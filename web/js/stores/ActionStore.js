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

        //register BaseStore actions
        this.registerActions();
    }

    filter(project = null, env = null, placement = null) {
        let result = this.all.filter(action => {
            if (action.placement == placement) {
                switch (placement) {
                    case "project":
                        if (!action.project || action.project == project.id) {
                            return true;
                        }
                        break;
                    case "environment":
                        if (!action.environment || action.environment == env.id) {
                            return true;
                        }
                        break;
                    case "card":
                        if (!action.environment && !action.project) {
                            return true;
                        } else
                        if (!action.environment && action.project == project.id) {
                            return true;
                        } else
                        if (!action.project && action.environment == env.id) {
                            return true;
                        } else
                        if (action.environment == env.id && action.project == project.id) {
                            return true;
                        }
                        break;
                }

            }
            return false;
        });

        return result;
    }
}

export default new ActionStore();
