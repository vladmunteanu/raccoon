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
    }

    filter(project = null, env = null, placement = null) {
        let result = this.all.filter(action => {
            console.log("[ placemant] ", action);
            if (action.placement == placement) {
                if (placement == "project") {
                    if (!project) {
                        return true;
                    } else
                    if (action.project == project.id) {
                        return true;
                    }
                } else
                if (placement == "environment") {
                    if (!env) {
                        return true;
                    } else
                    if (action.environment == env.id) {
                        return true;
                    }
                } else
                if (placement == "card") {
                    if (!project && !env) {
                        return true;
                    } else
                    if (action.project == project.id) {
                        return true;
                    }
                }
            }

        });

        return result;
    }

}

export default new ActionStore();
