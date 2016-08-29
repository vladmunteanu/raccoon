//var keyMirror = require('keyMirror');

//
// Define constants
class Config {

    constructor () {
        this.WS_URL = 'ws://' + location.host + '/websocket';
        this.CONNECTOR_TYPE = {
            "github": {
                "url": "insert git url",
                "token": "insert git token"
            },
            "jenkins": {
                "url": "insert jenkins url",
                "token": "insert jenkins token"
            },
            "salt": {
                "username": "insert salt username here",
                "password": "insert salt password here",
                "url": "insert salt url here"
            }
        }
    }
}

let config = new Config();

export default config;