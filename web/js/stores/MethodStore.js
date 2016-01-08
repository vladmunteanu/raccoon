import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';

import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';


let methodStore = null;

class MethodStore extends BaseStore {

    constructor() {
        if (!methodStore) {
            super();
            methodStore = this;
        } else {
            return methodStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/methods/";

    }

}

export default new MethodStore();
