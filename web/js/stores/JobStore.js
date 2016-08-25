import React from 'react';

import BaseStore from './BaseStore';

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

        // register BaseStore actions
        this.registerActions();
    }

}

export default new JobStore();
