import React from 'react';
import FluxStore from 'flux';

// stores
import BaseStore from './BaseStore';

import AppDispatcher from '../dispatcher/AppDispatcher';
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
        // ignore:
        // - 200 OK GET messages
        if (message.code == 200 && message.verb.toUpperCase() == 'GET')
            return ;

        this.instances = this.instances || [];
        this.instances.push(message);
        this.emitChange();
    }

    pop() {
        return this.instances.pop();
    }

    clear() {
        this.instances = [];
        this.emitChange();
    }

    display(notificationSystem) {
        // Consume each notification and add it into notification system

        let notif = this.pop();
        while (notif) {
            let r = notif.resource.match(/\/api\/v1\/([\w-]+)[\/]?([\w-]+)?/);
            let model = r[1], id = r[2];
            let key = `HTTP-${notif.code}-${notif.verb.toUpperCase()}-${model}`;
            notificationSystem.addNotification({
                message: key,
                level: 'info',
                position: 'br'
            });

            notif = this.pop();
        }
    }
}

export default new NotificationStore();
