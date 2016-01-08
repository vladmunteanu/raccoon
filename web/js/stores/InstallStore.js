import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';

import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';


let installStore = null;

class InstallStore extends BaseStore {

    constructor() {
        if (!installStore) {
            super();
            installStore = this;
        } else {
            return installStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/installs/";

    }

}

export default new InstallStore();
