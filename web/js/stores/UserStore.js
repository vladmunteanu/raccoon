import React from 'react';
import FluxStore from 'flux';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;


let userStore = null;
let _users = [];

let dispatchToken = AppDispatcher.register(function(payload) {
    switch (payload.action) {
        case 'GET /api/v1/users/':
            _users = payload.data;
            new UserStore().emitChange();
            break;

        case ActionTypes.USER_TOGGLE_VISIBLE:
            new UserStore().toggleVisible(payload.data.id);
            break;

        default:
        // do nothing

    }
});

class UserStore extends EventEmitter {

    constructor() {
        if (!userStore) {
            super();
            userStore = this;
        } else {
            return userStore;
        }

        _users = [];
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
        let user = new Connector();
        user.send({
            verb: 'get',
            resource: '/api/v1/users/',
        });
    }

    get all() {
        return _users;
    }

    toggleVisible(id) {
        _users.map(function (action) {
            if (action.id == id) {
                action.visible = !action.visible;
            }
        });
        this.emitChange();
    }
}

export default new UserStore();
