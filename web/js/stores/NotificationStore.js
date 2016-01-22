import React from 'react';
import FluxStore from 'flux';

import AppDispatcher from '../dispatcher/AppDispatcher';
import BaseStore from './BaseStore';
import Connector from '../utils/Connector';

import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;

let notificationStore = null;

class NotificationStore extends BaseStore {

    constructor() {
        if (!notificationStore) {
            super();
            notificationStore = this;
        } else {
            return notificationStore;
        }

        // register gui related actions
        AppDispatcher.registerOnce(ActionTypes.NOTIFICATION, payload => {
            this.push(payload);
        });
    }

    push(message) {
        this.instances = this.instances || [];

        this.instances.push(message);
        this.emitChange();
    }

    pop() {
        return this.instances.pop();
    }

 /*   get all() {
        let result = this.instances;
//        this.instances = null;

        return result;
    }*/

}

export default new NotificationStore();
