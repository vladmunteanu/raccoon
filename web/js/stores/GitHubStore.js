import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';
import Connector from '../utils/Connector';
import BaseStore from './BaseStore';


let gitHubStore = null;

class GitHubStore extends BaseStore {

    constructor() {
        if (!gitHubStore) {
            super();
            gitHubStore = this;
        } else {
            return gitHubStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/github/";
        this._branches = [];
        this._commits = [];
    }

    get branches() {
        return this._branches;
    }

    fetchBranches(project_id) {
        // reset current branches
        this._branches = [];
        this.emitChange();

        let connector = new Connector();

        connector.send({
            verb: 'get',
            resource: this.baseuri + 'branches',
            args: {
                project: project_id,
            }
        }, payload => {
            this._branches = payload.data;
            this.emitChange();
        });
    }

    get commits() {
        return this._commits;
    }

    fetchCommits(project_id) {
        // reset current commits
        this._commits = [];
        this.emitChange();

        let connector = new Connector();

        connector.send({
            verb: 'get',
            resource: this.baseuri + 'commits',
            args: {
                project: project_id,
            }
        }, payload => {
            if (this._commits != payload.data) {
                this._commits = payload.data;
                this.emitChange();
            }
        });
    }

}

export default new GitHubStore();
