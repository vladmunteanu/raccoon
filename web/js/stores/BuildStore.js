import React from 'react';

import BaseStore from './BaseStore';

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

        //register BaseStore actions
        this.registerActions();
    }

    filter(projectId) {
        return this.all.filter(build => {
            return build.project == projectId;
        });
    }
}

export default new BuildStore();
