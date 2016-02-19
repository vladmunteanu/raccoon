import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';

import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;
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

        AppDispatcher.registerOnce(ActionTypes.UPDATE_METHOD, payload => {
            this.updateById(payload.data.id, payload.data);
        });
        AppDispatcher.registerOnce(ActionTypes.CREATE_METHOD, payload => {
            this.create(payload.data);
        });

    }

}

export default new MethodStore();
