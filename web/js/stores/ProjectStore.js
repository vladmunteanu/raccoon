import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import Connector from '../utils/Connector';


let _projects = [];

class ProjectStore extends EventEmitter {

    constructor() {
        /*if (!projectStore) {
            super();
            projectStore = this;
        } else {
            return projectStore;
        }*/
        super();
        _projects = [];
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

}

let projectStore = new ProjectStore();

ProjectStore.dispatchToken = AppDispatcher.register(function(payload) {
    switch (payload.requestResource) {
        case '/api/v1/projects/':
            _projects = payload.data;
            projectStore.emitChange();
            break;

        default:
            // do nothing

    }
});

export default projectStore;
