import React from 'react';
import FluxStore from 'flux';

import RaccoonApp from './../components/RaccoonApp.react.js';
import AppDispatcher from '../dispatcher/AppDispatcher';
import BaseStore from './BaseStore';
import Connector from '../utils/Connector';

import Constants from '../constants/Constants';
let ActionTypes = Constants.ActionTypes;

let projectStore = null;

class ProjectStore extends BaseStore {

    constructor() {
        if (!projectStore) {
            super();
            projectStore = this;
        } else {
            return projectStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/projects/";

        // register gui related actions
        AppDispatcher.registerOnce(ActionTypes.PROJECT_TOGGLE_VISIBLE, payload => {
            this.toggleVisible(payload.data.id);
        });

        AppDispatcher.registerOnce('PUT ' + '/api/v1/projects/', payload => {
            console.log(['constructor', payload, this.instances]);

            this.instances = this.instances.map(instance => {
                if (instance.id === payload.data.id) {
                    return payload.data;
                } else {
                    return instance;
                }
            });
            console.log([this.instances]);
            this.emitChange();
        })

    }

    toggleVisible(id) {
        let project = this.getById(id);
        let state = RaccoonApp.getBrowserState();

        project.visible = !project.visible;
        state.toggle.project[project.id] = project.visible;
        RaccoonApp.saveBrowserState(state);

        this.emitChange();
    }

    getToggle(id) {
        let project = this.getById(id);
        let state = RaccoonApp.getBrowserState();

        if (!project.hasOwnProperty("visible")) {
            project.visible = !!state.toggle.project[project.id];
        }

        return project.visible;
    }

    set all(data) {
        this.instances = data || [];
        this.instances.map(item => {
            item.visible = this.getToggle(item.id)
        });

        this.emitChange();
    }

    get all() {
        return this.instances || [];
    }

}

export default new ProjectStore();
