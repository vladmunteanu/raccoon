import React from 'react';
import FluxStore from 'flux';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';
import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import Utils from '../utils/Utils';


import jwt_decode from 'jwt-decode';


let authStore = null;
let _user = null;

class AuthStore extends BaseStore {

    constructor() {
        if (!authStore) {
            super();
            authStore = this;
        } else {
            return authStore;
        }

        _user = null;
        this._error = null;
    }

    authenticate(data) {
        let connector = new Connector();
        connector.send({
            verb: 'post',
            resource: '/api/v1/auth/',
            body: {
                email: data.email,
                password: data.password,
            }
        }, payload => {
            if (payload.code == 200) {
                this.save(payload.data);
            }
        });
    }

    register(data) {
        let connector = new Connector();
        connector.send({
            verb: 'post',
            resource: '/api/v1/users/',
            body: {
                name: data.name,
                email: data.email,
                password: data.password
            }
        }, payload => {
            if (payload.code == 200) {
                this.save(payload.data);
            }
        });
    }

    fetchMe() {
        let connector = new Connector();
        connector.send({
            verb: 'get',
            resource: '/api/v1/users/' + this.userId,
        }, payload => {
            this.saveMe(payload.data);
        });
    }

    saveMe(data) {
        _user = data;
        _user.avatarUrl = Utils.gravatarUrl(_user.email);

        this.emitChange();
    }

    save(data) {
        localStorage.setItem('token', data.token);
        this.emitChange();
    }

    set error(error) {
        this._error = error;
        if (error) {
            this.emitChange();
        }
    }

    get error() {
        return this._error;
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

export default new AuthStore();
