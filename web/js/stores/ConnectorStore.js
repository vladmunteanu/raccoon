import React from 'react';
import FluxStore from 'flux';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;


let connectorStore = null;
let _connectors = [];

let dispatchToken = AppDispatcher.register(function(payload) {
    switch (payload.action) {
        case 'GET /api/v1/connectors/':
            _connectors = payload.data;
            new ConnectorStore().emitChange();
            break;

        case ActionTypes.CONNECTOR_TOGGLE_VISIBLE:
            new ConnectorStore().toggleVisible(payload.data.id);
            break;

        default:
        // do nothing

    }
});

class ConnectorStore extends EventEmitter {

    constructor() {
        if (!connectorStore) {
            super();
            connectorStore = this;
        } else {
            return connectorStore;
        }

        _connectors = [];
        this.dispatchToken = dispatchToken;
    }

    emitChange() {
        this.emit('change');
    }

    addListener(callback) {
        this.on('change', callback);
    }

    removeListener(callback) {
        super.removeListener('change', callback);
    }

    fetchAll() {
        let connector = new Connector();
        connector.send({
            verb: 'get',
            resource: '/api/v1/connectors/',
        });
    }

    get all() {
        return _connectors;
    }

    toggleVisible(id) {
        _connectors.map(function (action) {
            if (action.id == id) {
                action.visible = !action.visible;
            }
        });
        this.emitChange();
    }
}

export default new ConnectorStore();
