import React from 'react';
import { EventEmitter } from 'events';

import AppDispatcher from '../dispatcher/AppDispatcher';
import WebSocketConnection from '../utils/WebSocketConnection';

const MAX_LISTENERS = 100;

class BaseStore extends EventEmitter {
    constructor() {
        super();
        this.baseuri = null;
        this.instances = {};

        // increase listeners limit
        this.setMaxListeners(MAX_LISTENERS);
    }

    registerActions() {
        AppDispatcher.registerOnce('PUT ' + this.baseuri, payload => {
            if (payload.code === 200) {
                let tmpObj = this.instances[payload.data.id] || {};
                Object.keys(payload.data).forEach((key) => {
                    tmpObj[key] = payload.data[key];
                });
                this._addInstance(tmpObj);
                this.emitChange();
            }
        });

        AppDispatcher.registerOnce('PATCH ' + this.baseuri, payload => {
            let tmpObj = this.instances[payload.data.id] || {};
            Object.keys(payload.data).forEach((key) => {
                tmpObj[key] = payload.data[key];
            });
            this._addInstance(tmpObj);
            this.emitChange();
        });

        AppDispatcher.registerOnce('POST ' + this.baseuri, payload => {
            this._addInstance(payload.data);
            this.emitChange();
        });

        AppDispatcher.registerOnce('DELETE ' + this.baseuri, payload => {
            if (payload.code === 200) {
                delete this.instances[payload.data];
                this.emitChange();
            }
        });
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

    get all() {
        return Object.values(this.instances);
    }

    set all(data) {
        this.instances = data || {};
        this.emitChange();
    }

    fetchAll() {
        let wsConnection = new WebSocketConnection();

        wsConnection.send({
            verb: 'get',
            resource: this.baseuri
        }, payload => {
            payload.data.map(item => {
                this._addInstance(item);
            });
            this.emitChange();
        });
    }

    /**
     * Method to lookup a certain instance locally, identified by its id.
     * @param id: primary key
     * @returns: instance identified by id
     */
    getById(id) {
        return this.instances[id];
    }

    /**
     * Trigger method to fetch a specific instance, identified by its id.
     *
     * @param id: instance primary key
     */
    fetchById(id) {
        let instance = this.getById(id);

        // if we don't have the instance, fetch it
        if (!instance) {
            let wsConnection = new WebSocketConnection();
            wsConnection.send({
                verb: 'get',
                resource: this.baseuri + id,
            }, payload => {
                this._addInstance(payload.data);
                this.emitChange();
            }, true);
        }
        // emit a change if we have the instance already
        else {
            this.emitChange();
        }
    }

    updateById(id, data) {
        let wsConnection = new WebSocketConnection();
        wsConnection.send({
            verb: 'put',
            resource: this.baseuri + id,
            body: data
        });
    }

    create(data) {
        let wsConnection = new WebSocketConnection();
        wsConnection.send({
            verb: 'post',
            resource: this.baseuri,
            body: data
        });
    }
    
    deleteByid(id) {
        let wsConnection = new WebSocketConnection();
        wsConnection.send({
            verb: 'delete',
            resource: this.baseuri + id
        });
    }

    jobValues() {
        return [];
    }

    _addInstance(instance) {
        this.instances[instance.id] = instance;
    }
}

BaseStore.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default BaseStore;
