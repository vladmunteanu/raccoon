import { WS_URL } from '../config/Config';

// var queue = [];

// class Connector {
//     constructor(options) {
//         console.log(['aaaa', WS_URL])
//         this.ws = new WebSocket(WS_URL);
//         this.ws.onopen = this.onOpen;
//         this.ws.onmessage = this.onMessage;
//         this.ws.onerror = this.onError;
//         this.ws.onclose = this.onClose;
//         queue = [];
//     }  

//     onOpen() {
//         queue.forEach(function (message) {
//             console.log(['opened', this, message]);
//             this.send(message);
//         }, this);
//     };

//     callback

//     onMessage(event) {
//        console.log(['message', event.data]);
//     }

//     onError(a, b, c, d) {
//        console.log(['error', a, b, c, d]);
//     }

//     onClose(a, b, c, d) {
//        console.log(['closed', a, b, c, d]);
//     }

//     send(message, callback) {
//         if (this.ws.readyState == 1) {
//             this.ws.send(message);
//         } else {
//             console.log(['queued', message, callback])
//             queue.push([message, callback])
//         }
//     }
// }

// module.exports = new Connector();


'use strict';
function SocketService() {
    var service = {};
    var pendingCallbacks = {};
    var currentMessageId = 0;
    var ws;
    var preConnectionRequests = [];
    var connected = false;

    function init() {
        service = {};
        pendingCallbacks = {};
        currentMessageId = 0;
        preConnectionRequests = [];
        connected = false;

        ws = new WebSocket(WS_URL);

        ws.onopen = function () {
            connected = true;
            if (preConnectionRequests.length === 0) return;

            console.log('Sending (%d) requests', preConnectionRequests.length);
            for (var i = 0, c = preConnectionRequests.length; i < c; i++) {
                ws.send(JSON.stringify(preConnectionRequests[i]));
            }
            preConnectionRequests = [];
        };
        ws.onclose = function() {
            connected = false;
        };
        ws.onmessage = function (message) {
            listener(JSON.parse(message.data));
        };
    }

    init();

    function sendRequest(request, cb) {
        // websocket closing / closed, reconnect
        if(ws && ~[2,3].indexOf(ws.readyState)) {
            connected = false;
            init();
        }

        request.$id = generateMessageId();
        pendingCallbacks[request.$id] = cb;

        if (!connected) {
            //console.log('Not connected yet, saving request', request);
            preConnectionRequests.push(request);
        } else {
            //console.log('Sending request', request);
            ws.send(JSON.stringify(request));
        }
        return request.$id;
    }

    function listener(message) {
        //console.log('listener, id:', message.$id, 'ws.readyState', ws.readyState);
        // If an object exists with id in our pendingCallbacks object, resolve it
        if (pendingCallbacks.hasOwnProperty(message.$id))
            pendingCallbacks[message.$id](message);
    }

    function requestComplete(id) {
        //console.log("requestComplete:", id, 'ws.readyState', ws.readyState);
        delete pendingCallbacks[id];
    }

    function stopRequest(id) {
        ws.close();
        init();
    }

    function generateMessageId() {
        if (currentMessageId > 10000)
            currentMessageId = 0;

        return new Date().getTime().toString() + '~' + (++currentMessageId).toString();
    }

    service.sendRequest = sendRequest;
    service.requestComplete = requestComplete;
    service.stopRequest = stopRequest;
    return service;
}

module.exports = new SocketService();
