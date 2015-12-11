import React from 'react';
import FluxStore from 'flux';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';
import Connector from '../utils/Connector';
import LoginAction from '../actions/LoginAction';
import Utils from '../utils/Utils';

import Constants from '../constants/Constants';
let ActionTypes = Constants.ActionTypes;

import jwt_decode from 'jwt-decode';


let loginStore = null;
let _user = null;
let _token = null;

let dispatchToken = AppDispatcher.register(function(payload) {
    let loginStore = new LoginStore();

    switch (payload.action) {
        case 'POST /api/v1/auth/':
            loginStore.save(payload.data);
            break;

        case 'GET /api/v1/users/' + loginStore.userId:
            loginStore.saveMe(payload.data);
            break;

        case ActionTypes.LOGIN_USER:
            loginStore.authenticate(payload.data);
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

    fetchMe() {
        let connector = new Connector();
        connector.send({
            verb: 'get',
            resource: '/api/v1/users/' + this.userId,
        });
    }

    saveMe(data) {
        _user = data;
        _user.avatarUrl = 'https://secure.gravatar.com/avatar/' + Utils.md5(_user.email) + '?d=mm';

        this.emitChange();
    }

    save(data) {
        _token = data.token;
        localStorage.setItem('token', _token);
        this.emitChange();
    }

    get me() {
        return _user;
    }

    get userId() {
        let id = null;
        try {
            id = jwt_decode(this.token).id;
        } catch (e) {

        }
        return id
    }

    get token() {
        return localStorage.getItem('token');
    }

    isLoggedIn() {
        return !!localStorage.getItem('token');
    }
}

export default new LoginStore();
