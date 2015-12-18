import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;


let actionStore = null;
let _actions = [];

let dispatchToken = AppDispatcher.register(function(payload) {
    switch (payload.action) {
        case 'GET /api/v1/actions/':
            _actions = payload.data;
            new ActionStore().emitChange();
            break;

        case ActionTypes.PROJECT_TOGGLE_VISIBLE:
            new ActionStore().toggleVisible(payload.data.id);
            break;

        default:
        // do nothing

    }
});

class ActionStore extends EventEmitter {

    constructor() {
        if (!actionStore) {
            super();
            actionStore = this;
        } else {
            return actionStore;
        }

        _actions = [];
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
            resource: '/api/v1/actions/',
        });
    }

    filter(project=null, environment=null) {
        return _actions;
    }

    get all() {
        return _actions;
    }

    toggleVisible(id) {
        _actions.map(function (action) {
            if (action.id == id) {
                action.visible = !action.visible;
            }
        });
        this.emitChange();
    }
}

export default new ActionStore();
