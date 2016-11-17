import React from 'react';

import BaseStore from './BaseStore';
import WebSocketConnection from '../utils/WebSocketConnection';
import Utils from '../utils/Utils';

let saltStore = null;


/**
 * Represents the Store for SaltStack.
 * Offers two generic methods, runCommand and getResult,
 * to execute commands on the Salt master, and view their results.
 */
class SaltStore extends BaseStore {

    constructor () {
        if (!saltStore) {
            super();
            saltStore = this;
        } else {
            return saltStore;
        }

        this.baseuri = "/api/v1/salt/";

        this._command_results = {};
    }

    /**
     * Returns the result of the command specified by commandId.
     * @param {string} commandId: UUID obtained by executing runCommand
     * @returns {object} Command result
     */
    getResult(commandId) {
        return this._command_results[commandId];
    }

    /**
     * Sends the command to the Salt controller and returns a UUID associated
     * with this command, which can be used later to view the result.
     * When a response is received from the backend, the result is added
     * in the map and all listeners are notified.
     *
     * @param {string} cmd: command to execute
     * @param {object} args: arguments which will be sent to the controller
     * @returns {string} UUID command Id.
     */
    runCommand(cmd, args) {
        if (!cmd) return null;
        let wsConnection = new WebSocketConnection();

        let commandBody = Object.assign({}, args, {fun: cmd});

        // Generate a unique ID for this command
        let commandId = Utils.uuid();

        // Send the command and register an unique callback
        wsConnection.send({
            verb: 'post',
            resource: this.baseuri + 'run',
            body: commandBody
        }, payload => {
            this._command_results[commandId] = payload.data.return[0];
            this.emitChange();
        }, true);

        return commandId;
    }
}

export default new SaltStore();
