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

        console.log('000000000000 register');

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
            console.log('BUILD started', payload.data);
            this.emitChange();
        });
    }
}

export default new JenkinsStore();
