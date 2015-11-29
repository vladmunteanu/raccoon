import { WS_URL } from '../config/Config';

'use strict';

let connector = null;

class Connector {

    // singleton
    constructor() {
        // deal with the instance before starting to allocate resources
        if (!connector) {
            connector = this;
        } else {
            return connector;
        }

        this.connected = false;
        this.pendingRequests = [];
        this.pendingCallbacks = [];
        this.currentMessageId = 0;

        this.ws = null;
        this.connect();
    }

    connect() {
        if (!this.ws) {
            this.ws = new WebSocket(WS_URL);
            this.ws.onopen = Connector.onOpen;
            this.ws.onmessage = Connector.onMessage;
            //this.ws.onclose = Connector.onClose;
            // this.ws.onerror = Connector.onError;

            console.log("Socket connected!");
        }
    }

    // ws context, using connector instance 
    static onOpen() {
        connector.connected = true;

        if (connector.pendingRequests.length > 0) {
            connector.pendingRequests.forEach(req => {
                this.send(JSON.stringify(req));
            });
            connector.pendingRequests = [];
        }
    }

    // ws context, using connector instance
    static onMessage(message) {
        connector.processMessage(JSON.parse(message.data));
    }

    processMessage(message) {
        if (this.pendingCallbacks.hasOwnProperty(message.$id)) {
            this.pendingCallbacks[message.$id](message);
            // freeing some memory
            delete this.pendingCallbacks[message.$id];
        }
    }

    generateMessageId() {
        if (this.currentMessageId > 10000)
            this.currentMessageId = 0;

        return new Date().getTime().toString() + '~' + (++this.currentMessageId).toString();
    }

    send(request, callback) {
        if(this.ws && ~[2,3].indexOf(this.ws.readyState)) {
            this.connected = false;
            this.connect();
        }

        request.$id = this.generateMessageId();
        this.pendingCallbacks[request.$id] = callback;

        if (!this.connected) {
            this.pendingRequests.push(request);
        } else {
            this.ws.send(JSON.stringify(request));
        }

        return request.$id;
    }

    stopRequest(id) {
        this.ws.close();
        this.connect();
    }
}

export default Connector;

