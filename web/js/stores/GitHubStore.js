import React from 'react';

import WebSocketConnection from '../utils/WebSocketConnection';
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
        return this._branches || [];
    }

    fetchBranches(project_id) {
        // reset current branches
        this._branches = [];

        let wsConnection = new WebSocketConnection();

        wsConnection.send({
            verb: 'get',
            resource: this.baseuri + 'branches',
            args: {
                project: project_id
            }
        }, payload => {
            this._branches = payload.data;
            this.emitChange();
        }, true);
    }

    get commits() {
        return this._commits;
    }

    fetchCommits(project_id, branch) {
        // reset current commits
        this._commits = [];

        let wsConnection = new WebSocketConnection();

        wsConnection.send({
            verb: 'get',
            resource: this.baseuri + 'commits',
            args: {
                project: project_id,
                branch: branch
            }
        }, payload => {
            this._commits = payload.data;
            this.emitChange();
        }, true);
    }

}

export default new GitHubStore();
