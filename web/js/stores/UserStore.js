import React from 'react';
import FluxStore from 'flux';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';


let userStore = null;

class UserStore extends BaseStore {

    constructor() {
        if (!userStore) {
            super();
            userStore = this;
        } else {
            return userStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/users/";

    }

}

export default new UserStore();
