import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';

import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import AuthStore from './AuthStore';

let jobStore = null;

class JobStore extends BaseStore {

    constructor() {
        if (!jobStore) {
            super();
            jobStore = this;
        } else {
            return jobStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/jobs/";

        //register BaseStore actions
        this.registerActions();
    }

}

export default new JobStore();
