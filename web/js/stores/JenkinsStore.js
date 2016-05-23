import React from 'react';
import FluxStore from 'flux';

import AppDispatcher from '../dispatcher/AppDispatcher';
import Connector from '../utils/Connector';

import BaseStore from './BaseStore';
import BuildStore from './BuildStore';

import Constants from '../constants/Constants';
let ActionTypes = Constants.ActionTypes;

let jenkinsStore = null;

class JenkinsStore extends BaseStore {

    constructor() {
        if (!jenkinsStore) {
            super();
            jenkinsStore = this;
        } else {
            return jenkinsStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/jenkins/";

        this.jobInstances = [];

        // register gui related actions
        AppDispatcher.registerOnce('jenkins', payload => {
            let method_name = payload.data['method'];
            let args = payload.data['args'];

            this[method_name](args);
        });
    }

    build(args) {
        let connector = new Connector();

        connector.send({
            verb: 'post',
            resource: this.baseuri + 'build',
            body: args,
        }, payload => {
            BuildStore.create({
                project: args.project,
                branch: args.branch,
                version: args.version || '1.0.0',
            });

            this.emitChange();
        });
    }

    get jobs() {
        if (this.jobInstances.length == 0) {
            let connector = new Connector();
            connector.send({
                verb: 'get',
                resource: this.baseuri + 'jobs'
            }, payload => {
                this.jobs = payload.data;
            });
        }
        return this.jobInstances || [];
    }

    set jobs(data) {
        this.jobInstances = data || [];
        this.emitChange();
    }
}

export default new JenkinsStore();
