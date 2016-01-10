import React from 'react';
import FluxStore from 'flux';

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
        AppDispatcher.registerOnce(ActionTypes.UPDATE_PROJECT, payload => {
            this.updateById(payload.data.id, payload.data);
        });
        AppDispatcher.registerOnce(ActionTypes.CREATE_PROJECT, payload => {
            this.create(payload.data);
        });
    }

    toggleVisible(id) {
        this.all.map(function (project) {
            if (project.id == id) {
                project.visible = !project.visible;
            }
        });
        this.emitChange();
    }
}

export default new ProjectStore();
