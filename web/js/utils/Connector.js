'use strict';

import config from '../config/Config';
import Utils from '../utils/Utils';
import AppDispatcher from '../dispatcher/AppDispatcher';

import Constants from '../constants/Constants';
import AuthStore from '../stores/AuthStore';

let connector = null;

class Connector {

    /**
     * Creates connector instance.
     * @returns singleton instance
     */
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
            this.ws = new WebSocket(config.WS_URL);
            this.ws.onopen = Connector.onOpen;
            this.ws.onmessage = Connector.onMessage;
            //this.ws.onclose = Connector.onClose;
            // this.ws.onerror = Connector.onError;

            console.log("Socket connected!");
        }
    }

    /**
     * Implementation of ws.onopen
     * Send all pendingRequests to the backend.
     */
    static onOpen() {
        connector.connected = true;

        if (connector.pendingRequests.length > 0) {
            connector.pendingRequests.forEach(req => {
                this.send(JSON.stringify(req));
            });
            connector.pendingRequests = [];
        }
    }

    /**
     * Implementation of ws.onmessage
     * @param message
     */
    static onMessage(message) {
        connector.processMessage(JSON.parse(message.data));
    }

    /**
     * Process the response of the backend server by running the assigned callback.
     * @param message
     */
    processMessage(message) {


        // dispatch message
        message.action = Constants.ActionTypes.ERROR;

        if (message.hasOwnProperty('verb') && message.hasOwnProperty('resource') ) {
            message.action = message.verb.toUpperCase() + ' ' + message.resource;
        }

        console.log(message)
        AppDispatcher.dispatch(message);

       /* if (typeof this.pendingCallbacks[message.requestId] !== 'undefined') {
            this.pendingCallbacks[message.requestId](message);
            // freeing some memory
            delete this.pendingCallbacks[message.requestId];
        }*/
    }

    /**
     * Send the request to server. Add to pendingRequests if connection is not yet available.
     * @param request
     * @param callback
     * @returns request.requestId
     */
    send(request, callback) {
        if(this.ws && ~[2,3].indexOf(this.ws.readyState)) {
            this.connected = false;
            this.connect();
        }

        request.requestId = Utils.uuid();

        // set authorization headers
        let headers = request.headers || {};
        headers['Authorization'] = 'Bearer ' + AuthStore.token;
        request.headers = headers;

        this.pendingCallbacks[request.requestId] = callback;

        if (callback) {
            //registering actions
            let action = request.verb.toUpperCase() + ' ' + request.resource;
            AppDispatcher.registerOnce(action, callback);
        }

        if (!this.connected) {
            this.pendingRequests.push(request);
        } else {
            this.ws.send(JSON.stringify(request));
        }

        return request.requestId;
    }

    /**
     * Stops on-going request id and re-initializes the connection.
     * @param id
     */
    stopRequest(id) {
        this.ws.close();
        this.connect();
    }
}

export default Connector;

