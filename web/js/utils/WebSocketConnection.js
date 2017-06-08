'use strict';

import config from '../config/Config';
import Utils from '../utils/Utils';
import AppDispatcher from '../dispatcher/AppDispatcher';

import Constants from '../constants/Constants';
import AuthStore from '../stores/AuthStore';

let ActionTypes = Constants.ActionTypes;


let connector = null;

class WebSocketConnection {

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
        this.uniqueRequests = {};

        this.ws = null;
        this.connect();

        // initialize the loop which will check the connection
        this.keepConnectionAlive = this.keepConnectionAlive.bind(this);
        setInterval(this.keepConnectionAlive, 10000);
    }

    connect() {
        if (!this.ws) {
            this.ws = new WebSocket(config.WS_URL);
            this.ws.onopen = WebSocketConnection.onOpen;
            this.ws.onmessage = WebSocketConnection.onMessage;
            this.ws.onclose = WebSocketConnection.onClose;
            this.ws.onerror = WebSocketConnection.onError;

            console.log("Socket connected!");
        }
    }

    keepConnectionAlive() {
        if (!this.connected) {
            console.log("Trying to reconnect");
            this.connect();
            if (!this.connected) {
                console.log("Failed, retrying in 10 seconds");
            }
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

    static onClose() {
        connector.ws = null;
        connector.connected = false;
        console.log("Connection closed!");
    }

    static onError() {
        connector.ws = null;
        connector.connected = false;
        console.log("Connection error!");
    }

    /**
     * Implementation of ws.onmessage
     * @param message
     */
    static onMessage(message) {
        connector.processMessage(JSON.parse(message.data));
    }

    /**
     * Processes a message and dispatches the appropriate payload.
     * @param message:
     */
    processMessage(message) {
        if (message.hasOwnProperty('verb') && message.hasOwnProperty('resource')) {
            let matches = message.resource.match(/^(\/api\/v1\/[a-z0-9]*\/).*$/i);
            let res = matches && matches[1];

            message.action = message.verb.toUpperCase() + ' ' + res;
            /**
             * If the includeRequestId flag was true when the message was sent
             * then we need to add the requestId in the payload
             */
            if (this.uniqueRequests[message.action + " " + message.requestId]) {
                message.action += ' ' + message.requestId;
            }

            AppDispatcher.dispatch(message);

            /**
             * Delete the unique callback,
             * and unregister it from the AppDispatcher
             */
            if (this.uniqueRequests[message.action]) {
                AppDispatcher.unregister(this.uniqueRequests[message.action]);
                delete this.uniqueRequests[message.action];
            }
        }

        // dispatch notifications
        if (message.hasOwnProperty('code') && message.requestId !== 'notification') {
            message.action = ActionTypes.NOTIFICATION;
            AppDispatcher.dispatch(message);
        }
    }

    /**
     * Send the request to server. Add to pendingRequests if connection is not yet available.
     * @param request:
     * @param callback: Callback function to register with AppDispatcher
     * @param includeRequestId: Adds the requestId in the action, before registering to AppDispatcher.
     *                          This is useful in case the same verb and resource are used for different purposes.
     * @returns request.requestId
     */
    send(request, callback, includeRequestId) {
        if(this.ws && ~[2,3].indexOf(this.ws.readyState) || !this.ws) {
            this.connected = false;
            this.connect();
        }

        request.requestId = Utils.uuid();

        // set authorization headers
        let headers = request.headers || {};
        let token = AuthStore.token;
        if (token) {
            headers['Authorization'] = 'Bearer ' + AuthStore.token;
        }
        request.headers = headers;

        this.pendingCallbacks[request.requestId] = callback;

        if (callback) {
            //registering actions (removing resource id and everything after the resource name)
            let matches = request.resource.match(/^(\/api\/v1\/[a-z0-9]*\/).*$/i);
            let res = matches && matches[1];
            let action = request.verb.toUpperCase() + ' ' + res + (includeRequestId ? ' ' + request.requestId : '');
            let registeredCallbackId = AppDispatcher.registerOnce(action, callback);

            if (includeRequestId) {
                this.uniqueRequests[action] = registeredCallbackId;
            }
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

export default WebSocketConnection;
