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
        this.instances = null;
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
        this.instances = data;
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
        if(!!!this.instances)
            return undefined;

        return this.instances.find(function(element, index, array) {
            return element.id === id;
        });
    }

    updateById(id, data) {
        let connector = new Connector();

        connector.send({
            verb: 'put',
            resource: this.baseuri + id,
            body: data
        }, payload => {
            let instance = this.instances.find(function(element, index, array) {
                return element.id === id;
            });
            instance = payload.data;
            this.emitChange();
        });
    }

    create(data) {
        let connector = new Connector();
        connector.send({
            verb: 'post',
            resource: this.baseuri,
            body: data
        }, payload => {
            this.emitChange();
        });
    }

}

export default BaseStore;
