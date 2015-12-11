import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import Connector from '../utils/Connector';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;


let projectStore = null;
let _projects = [];

let dispatchToken = AppDispatcher.register(function(payload) {
    switch (payload.action) {
        case 'GET /api/v1/projects/':
            _projects = payload.data;
            new ProjectStore().emitChange();
            break;

        case ActionTypes.PROJECT_TOGGLE_VISIBLE:
            new ProjectStore().toggleVisible(payload.data.id);
            break;

        default:
        // do nothing

    }
});

class ProjectStore extends EventEmitter {

    constructor() {
        if (!projectStore) {
            super();
            projectStore = this;
        } else {
            return projectStore;
        }

        _projects = [];
        this.dispatchToken = dispatchToken;
    }

    emitChange() {
        this.emit('change');
    }

    addListener(callback) {
        this.on('change', callback);
    }

    removeListener(callback) {
        super.removeListener('change', callback);
    }

    fetchAll() {
        let connector = new Connector();
        connector.send({verb: 'get', resource: '/api/v1/projects/'});
    }

    getAll() {
        return _projects;
    }

    toggleVisible(id) {
        _projects.map(function (project) {
            if (project.id == id) {
                //localStorage.
                project.visible = !project.visible;
            }
        });
        this.emitChange();
    }
}

export default new ProjectStore();
