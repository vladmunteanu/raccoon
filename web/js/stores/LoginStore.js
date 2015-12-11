import React from 'react';
import FluxStore from 'flux';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';
import Connector from '../utils/Connector';
import LoginAction from '../actions/LoginAction';
import Constants from '../constants/Constants';
let ActionTypes = Constants.ActionTypes;


let loginStore = null;
let _user = null;
let _token = null;

let dispatchToken = AppDispatcher.register(function(payload) {
    switch (payload.action) {
        case 'POST /api/v1/auth/':
            new LoginStore().save(payload.data);
            break;

        case ActionTypes.LOGIN_USER:
            new LoginStore().authenticate(payload.data);
            break;

        default:
        // do nothing
    }
});

class LoginStore extends EventEmitter {

    constructor() {
        if (!loginStore) {
            super();
            loginStore = this;
        } else {
            return loginStore;
        }

        _user = null;
        _token = null;
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

    authenticate(data) {
        let connector = new Connector();
        connector.send({
            verb: 'post',
            resource: '/api/v1/auth/',
            body: {
                username: data.username,
                password: data.password,
            }
        });
    }

    save(data) {
        console.log('a****************', data);
        _user = data.userId;
        _token = data.token;

        localStorage.setItem('token', _token);

        this.emitChange();
        //LoginAction.login(_token);
    }

    get user() {
        return _user;
    }

    get token() {
        return localStorage.getItem('token');
    }

    isLoggedIn() {
        return !!localStorage.getItem('token');
    }
}

export default new LoginStore();
