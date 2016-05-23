import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';

import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import AuthStore from './AuthStore';

let taskStore = null;

class TaskStore extends BaseStore {

    constructor() {
        if (!taskStore) {
            super();
            taskStore = this;
        } else {
            return taskStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/tasks/";

        //register BaseStore actions
        this.registerActions();
    }

}

export default new TaskStore();
