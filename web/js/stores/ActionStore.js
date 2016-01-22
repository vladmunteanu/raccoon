import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';

import BaseStore from './BaseStore';
import AuthStore from './AuthStore';

import Constants from '../constants/Constants';
let ActionTypes = Constants.ActionTypes;

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

        AppDispatcher.registerOnce(ActionTypes.UPDATE_ACTION, payload => {
            this.updateById(payload.data.id, payload.data);
        });
        AppDispatcher.registerOnce(ActionTypes.CREATE_ACTION, payload => {
            this.create(payload.data);
        });
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
