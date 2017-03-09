import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import WebSocketConnection from '../utils/WebSocketConnection';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';


const MAX_LISTENERS = 100;

class BaseStore extends EventEmitter {
    constructor() {
        super();
        this.baseuri = null;
        this.instances = [];

        // increase listeners limit
        this.setMaxListeners(MAX_LISTENERS);
    }

    registerActions() {
        AppDispatcher.registerOnce('PUT ' + this.baseuri, payload => {
            if (payload.code == 200) {
                this.instances = this.instances.map(instance => {
                    if (instance.id === payload.data.id) {
                        Object.keys(payload.data).forEach((key) => {
                            instance[key] = payload.data[key];
                        });
                    }
                    return instance;
                });
                this.emitChange();
            }
        });

        AppDispatcher.registerOnce('PATCH ' + this.baseuri, payload => {
            this.instances = this.instances.map(instance => {
                if (instance.id === payload.data.id) {
                    Object.keys(payload.data).forEach((key) => {
                        instance[key] = payload.data[key];
                    });
                }
                return instance;
            });
            this.emitChange();
        });

        AppDispatcher.registerOnce('POST ' + this.baseuri, payload => {
            this.instances.push(payload.data);
            this.emitChange();
        });

        AppDispatcher.registerOnce('DELETE ' + this.baseuri, payload => {
            if (payload.code == 200) {
                this.instances = this.instances.filter(instance => {
                    if (instance.id !== payload.data) {
                        return instance
                    }
                });
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
        return this.instances || [];
    }

    set all(data) {
        this.instances = data || [];
        this.emitChange();
    }

    fetchAll() {
        let wsConnection = new WebSocketConnection();

        wsConnection.send({
            verb: 'get',
            resource: this.baseuri
        }, payload => {
            this.all = payload.data;
        });
    }

    /**
     * Method to lookup a certain instance locally, identified by its id.
     * @param id: primary key
     * @returns: instance identified by id
     */
    getById(id) {
        if(!this.instances)
            return undefined;

        let instance = this.instances.find(function(element, index, array) {
            return element.id === id;
        });

        return instance;
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
                if (!this.getById(id)) {
                    this.instances.push(payload.data);
                }
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
        }/*, payload => {
            this.instances = this.instances.map(instance => {
                if (instance.id === payload.data.id) {
                    return payload.data;
                } else {
                    return instance;
                }
            });
            this.emitChange();
        }*/);
    }

    create(data) {
        let wsConnection = new WebSocketConnection();
        wsConnection.send({
            verb: 'post',
            resource: this.baseuri,
            body: data
        });/*, payload => {
            this.instances.push(payload.data);
            this.emitChange();
        });*/
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

}

BaseStore.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default BaseStore;
