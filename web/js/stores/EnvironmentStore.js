import React from 'react';
import AppDispatcher from '../dispatcher/AppDispatcher';

import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;
let environmentStore = null;


class EnvironmentStore extends BaseStore {

    constructor() {
        if (!environmentStore) {
            super();
            environmentStore = this;
        } else {
            return environmentStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/environments/";

        // register actions
        AppDispatcher.registerOnce(ActionTypes.ENVIRONMENT_TOGGLE_VISIBLE, payload => {
            this.toggleVisible(payload.data.id);
        });
        AppDispatcher.registerOnce(ActionTypes.UPDATE_ENVIRONMENT, payload => {
            this.updateById(payload.data.id, payload.data);
        });
        AppDispatcher.registerOnce(ActionTypes.CREATE_ENVIRONMENT, payload => {
            this.create(payload.data);
        });

    }

    toggleVisible(id) {
        this.all.map(function (env) {
            if (env.id == id) {
                env.visible = !env.visible;
            }
        });
        this.emitChange();
    }

}

export default new EnvironmentStore();
