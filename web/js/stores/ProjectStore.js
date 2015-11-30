import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import Connector from '../utils/Connector';


class ProjectStore extends EventEmitter {

    constructor() {
        /*if (!projectStore) {
            super();
            projectStore = this;
        } else {
            return projectStore;
        }*/
        super();
        this._projects = [];
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
        var self = this;

        connector.send({"verb": "get", "resource": "/api/v1/projects/"}, function (response) {
            console.log(response);
            this._projects = response.data;
            this.emitChange();

            //return response.data;
        }.bind(this));
    }

    getAll() {
        console.log(this._projects);
        return this._projects;
    }

}

let projectStore = new ProjectStore();

export default projectStore;
