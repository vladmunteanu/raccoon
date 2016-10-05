import React from 'react';

import BaseStore from './BaseStore';
let auditlogStore = null;

class AuditlogStore extends BaseStore {

    constructor() {
        if (!auditlogStore) {
            super();
            auditlogStore = this;
        } else {
            return auditlogStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/auditlogs/";

        // register actions
        this.registerActions();
    }

    filter(projectId) {
        return this.all.filter(build => {
            return build.project == projectId;
        });
    }
}

export default new AuditlogStore();
