import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import Connector from '../utils/Connector';


let projectStore = null;
let _projects = [];

let dispatchToken = AppDispatcher.register(function(payload) {
    switch (payload.requestResource) {
        case '/api/v1/projects/':
            _projects = payload.data;
            new ProjectStore().emitChange();
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
        // console.log(_projects);
        return _projects;
    }

    toggleVisible(id) {
        let project = _projects.map(function (project) {
            if (project.id == id) {
                localStorage.
                project.visible = !project.visible;
            }
        });
        this.emitChange();
    }
}

export default new ProjectStore();
