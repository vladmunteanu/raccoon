import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';


class BaseStore extends EventEmitter {
    constructor() {
        super();
        this.baseuri = null;
        this.instances = [];
    }

    registerActions() {
        AppDispatcher.registerOnce('PUT ' + this.baseuri, payload => {
            this.instances = this.instances.map(instance => {
                if (instance.id === payload.data.id) {
                    return payload.data;
                } else {
                    return instance;
                }
            });
            this.emitChange();
        });

        AppDispatcher.registerOnce('POST ' + this.baseuri, payload => {
            this.instances.push(payload.data);
            this.emitChange();
        });

        AppDispatcher.registerOnce('DELETE ' + this.baseuri, payload => {
            if (payload.code == 200)
                this.instances = this.instances.filter(instance => {
                    if (instance.id !== payload.data) {
                        return instance
                    }
                });
                this.emitChange();
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
        let connector = new Connector();

        connector.send({
            verb: 'get',
            resource: this.baseuri
        }, payload => {
            this.all = payload.data;
        });
    }

    getById(id) {
        if(!this.instances)
            return undefined;

        let instance = this.instances.find(function(element, index, array) {
            // TODO: remove this shit
            if (element.hasOwnProperty('config') && typeof element.config !== 'string') {
                element.config = JSON.stringify(element.config, undefined, 4);
            }
            return element.id === id;
        });

        return instance;
    }

    updateById(id, data) {
        let connector = new Connector();

        connector.send({
            verb: 'put',
            resource: this.baseuri + id,
            body: data
        });/*, payload => {
            this.instances = this.instances.map(instance => {
                if (instance.id === payload.data.id) {
                    return payload.data;
                } else {
                    return instance;
                }
            });
            console.log([this.instances]);
            this.emitChange();
        });*/
    }

    create(data) {
        let connector = new Connector();
        connector.send({
            verb: 'post',
            resource: this.baseuri,
            body: data
        });/*, payload => {
            this.instances.push(payload.data);
            this.emitChange();
        });*/
    }
    
    deleteByid(id) {
        let connector = new Connector();
        connector.send({
            verb: 'delete',
            resource: this.baseuri + id
        });
    }

}

export default BaseStore;
