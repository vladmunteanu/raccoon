import React from 'react';

import BaseStore from './BaseStore';
import WebSocketConnection from '../utils/WebSocketConnection';

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

    /**
     * Fetches builds with filters for project.
     *
     * @param project (optional): project object
     */
    fetchBuilds(project) {
        let wsConnection = new WebSocketConnection();

        let args = {};
        if (project) {
            args['project'] = project.id;
        }

        wsConnection.send({
            verb: 'get',
            resource: this.baseuri,
            args: args
        }, payload => {
            payload.data.map(item => {
                this.instances[item.id] = item;
            });
            this.emitChange();
        }, true);
    }
}

export default new BuildStore();
