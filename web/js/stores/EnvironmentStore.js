import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import Connector from '../utils/Connector';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;


let environmentStore = null;
let _environments = [];

let dispatchToken = AppDispatcher.register(function(payload) {
    switch (payload.action) {
        case 'GET /api/v1/environments/':
            _environments = payload.data;
            new EnvironmentStore().emitChange();
            break;

        case ActionTypes.ENVIRONMENT_TOGGLE_VISIBLE:
            new EnvironmentStore().toggleVisible(payload.data.id);
            break;

        default:
        // do nothing
            
    }
});

class EnvironmentStore extends EventEmitter {

    constructor() {
        if (!environmentStore) {
            super();
            environmentStore = this;
        } else {
            return environmentStore;
        }

        _environments = [];
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
        connector.send({verb: 'get', resource: '/api/v1/environments/'});
    }

    getAll() {
        // console.log(_environments);
        return _environments;
    }

    toggleVisible(id) {
        _environments.map(function (env) {
            if (env.id == id) {
                env.visible = !env.visible;
            }
        });
        this.emitChange();
    }

}

export default new EnvironmentStore();
