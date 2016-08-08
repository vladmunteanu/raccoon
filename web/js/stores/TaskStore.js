import React from 'react';

import BaseStore from './BaseStore';

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
