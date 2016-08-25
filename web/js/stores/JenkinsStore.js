import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';
import WebSocketConnection from '../utils/WebSocketConnection';

import BaseStore from './BaseStore';


let jenkinsStore = null;
let updateCounter = 0;
let waitingForData = false;

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
            let method_name = payload.data.method;
            let args = payload.data.args;
            this[method_name](args);
        });
    }

    build(args) {
        let wsConnection = new WebSocketConnection();

        wsConnection.send({
            verb: 'post',
            resource: this.baseuri + 'build',
            body: args
        }, payload => {
            console.log("Builded");
            this.emitChange();
        });
    }

    install(args) {
        let wsConnection = new WebSocketConnection();
        console.log("Triggered install", args);
        wsConnection.send({
            verb: 'post',
            resource: this.baseuri + 'install',
            body: args
        }, payload => {
            console.log("Installed");
            this.emitChange();
        });
    }

    stop(args) {
        let wsConnection = new WebSocketConnection();
        wsConnection.send({
            verb: 'post',
            resource: this.baseuri + 'stop',
            body: args
        }, payload => {
            console.log("Stopped");
            this.emitChange();
        });
    }

    get jobs() {
        if (this.jobInstances.length == 0 && !waitingForData) {
            let wsConnection = new WebSocketConnection();
            waitingForData = true;
            wsConnection.send({
                verb: 'get',
                resource: this.baseuri + 'jobs'
            }, payload => {
                updateCounter += 1;
                this.jobs = payload.data;
                waitingForData = false;
            });
        }
        return this.jobInstances || [];
    }

    set jobs(data) {
        this.jobInstances = data || [];
        this.emitChange();
    }

    jobValues() {
        return this.jobs;
    }
}

export default new JenkinsStore();
