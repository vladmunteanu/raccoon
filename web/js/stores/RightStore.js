import React from 'react';
import FluxStore from 'flux';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;


let rightStore = null;
let _rights = [];

let dispatchToken = AppDispatcher.register(function(payload) {
    switch (payload.action) {
        case 'GET /api/v1/rights/':
            _rights = payload.data;
            new RightStore().emitChange();
            break;

        case ActionTypes.RIGHT_TOGGLE_VISIBLE:
            new RightStore().toggleVisible(payload.data.id);
            break;

        default:
        // do nothing

    }
});

class RightStore extends EventEmitter {

    constructor() {
        if (!rightStore) {
            super();
            rightStore = this;
        } else {
            return rightStore;
        }

        _rights = [];
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
        let right = new Connector();
        right.send({
            verb: 'get',
            resource: '/api/v1/rights/',
        });
    }

    get all() {
        return _rights;
    }

    toggleVisible(id) {
        _rights.map(function (action) {
            if (action.id == id) {
                action.visible = !action.visible;
            }
        });
        this.emitChange();
    }
}

export default new RightStore();
