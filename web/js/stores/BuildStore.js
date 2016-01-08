import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';

import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';


let buildStore = null;

class BuildStore extends BaseStore {

    constructor() {
        if (!buildStore) {
            super();
            buildStore = this;
        } else {
            return buildStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/builds/";

    }

}

export default new BuildStore();
