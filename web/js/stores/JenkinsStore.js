import React from 'react';
import FluxStore from 'flux';

import AppDispatcher from '../dispatcher/AppDispatcher';
import BaseStore from './BaseStore';
import Connector from '../utils/Connector';

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
        AppDispatcher.registerOnce(ActionTypes.BUILD_START, payload => {
            this.build(payload.data);
        });
    }

    build(args) {
        let connector = new Connector();

        connector.send({
            verb: 'get',
            resource: this.baseuri + 'build',
            args: args,
        }, payload => {
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
