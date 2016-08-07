import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';
import Connector from '../utils/Connector';

import BaseStore from './BaseStore';
import BuildStore from './BuildStore';


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
        let connector = new Connector();

        connector.send({
            verb: 'post',
            resource: this.baseuri + 'build',
            body: args,
        }, payload => {
            console.log("Builded");
            this.emitChange();
        });
    }

    install(args) {
        let connector = new Connector();
        console.log("Triggered install", args);
        connector.send({
            verb: 'post',
            resource: this.baseuri + 'install',
            body: args,
        }, payload => {
            console.log("Installed");
            this.emitChange();
        });
    }

    stop(args) {
        let connector = new Connector();
        connector.send({
            verb: 'post',
            resource: this.baseuri + 'stop',
            body: args,
        }, payload => {
            console.log("Stopped");
            this.emitChange();
        });
    }

    get jobs() {
        if (this.jobInstances.length == 0 && !waitingForData) {
            let connector = new Connector();
            waitingForData = true;
            connector.send({
                verb: 'get',
                resource: this.baseuri + 'jobs'
            }, payload => {
                console.log(updateCounter, " received jobs: ", payload.data);
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
}

export default new JenkinsStore();
