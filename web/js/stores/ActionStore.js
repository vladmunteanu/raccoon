import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';

let actionStore = null;

class ActionStore extends BaseStore {

    constructor() {
        if (!actionStore) {
            super();
            actionStore = this;
        } else {
            return actionStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/actions/";
    }

    filter(project = null, env = null) {
        var result = this.all.filter(action => {
            let projectId = project ? project.id : null;
            let envId = env ? env.id : null;

            if (action.project == projectId && action.environment == envId) {
                return true;
            }
        });

        return result;
    }

}

export default new ActionStore();
