import React from 'react';

import BaseStore from './BaseStore';
import WebSocketConnection from '../utils/WebSocketConnection';

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

        //register BaseStore actions
        this.registerActions();
    }

    getLatestInstall(project, env) {
        let installs = this.all.filter(install => {
            return install.project == project.id && install.environment == env.id;
        });

        installs.sort((a, b) => {return b.date_added - a.date_added});

        if (installs.length > 0)
            return installs[0];

        return null;
    }

    /**
     * Fetches installs with filters for project and / or environment.
     *
     * @param project (optional): project object
     * @param env (optional): environment object
     */
    fetchInstalls(project, env) {
        let wsConnection = new WebSocketConnection();

        let args = {};
        if (project) {
            args['project'] = project.id;
        }
        if (env) {
            args['env'] = env.id;
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

export default new InstallStore();
