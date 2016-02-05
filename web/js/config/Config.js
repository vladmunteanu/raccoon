//var keyMirror = require('keyMirror');

//
// Define constants
class Config {

    constructor () {
        this.WS_URL = 'ws://localhost:8888/websocket';
        this.CONNECTOR_TYPE = {
            "git": {
                "url": "insert git url",
                "token": "insert git token"
            },
            "jenkins": {
                "url": "insert jenkins url",
                "token": "insert jenkins token"
            }
        }
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