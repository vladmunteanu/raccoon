//var keyMirror = require('keyMirror');

//
// Define constants
class Config {

    constructor () {
        this.WS_URL = 'ws://localhost:8888/websocket';

    }
    // connection
    //public const WS_URL = 'ws://localhost:8888/websocket';
    /*const WS_CLOSE: null;
    var WS_ERROR: null;
    var WS_CONNECTING: null;
    var WS_CONNECTED: null;
    var WS_DISCONNECTED: null;*/

}

let config = new Config();

export default config;