import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import Connector from '../utils/Connector';


let _environments = [];

let dispatchToken = AppDispatcher.register(function(payload) {
    switch (payload.requestResource) {
        case '/api/v1/environments/':
            _environments = payload.data;
            EnvironmentStore().emitChange();
            break;

        default:
        // do nothing
            
    }
});

class EnvironmentStore extends EventEmitter {

    constructor() {
        super();

        _environments = [];
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

    static fetchAll() {
        let connector = new Connector();
        connector.send({verb: 'get', resource: '/api/v1/environments/'});
    }

    static getAll() {
        // console.log(_environments);
        return _environments;
    }

}

//let environmentStore = new EnvironmentStore();

export default EnvironmentStore;
