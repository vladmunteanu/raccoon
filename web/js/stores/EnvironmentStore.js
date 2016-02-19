import React from 'react';
import AppDispatcher from '../dispatcher/AppDispatcher';

import RaccoonApp from './../components/RaccoonApp.react.js';
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
        let environment = this.getById(id);
        let state = RaccoonApp.getBrowserState();

        environment.visible = !environment.visible;
        state.toggle.environment[environment.id] = environment.visible;
        RaccoonApp.saveBrowserState(state);

        this.emitChange();
    }

    getToggle(id) {
        let environment = this.getById(id);
        let state = RaccoonApp.getBrowserState();

        if (!environment.hasOwnProperty("visible")) {
            environment.visible = !!state.toggle.environment[environment.id];
        }

        return environment.visible;
    }

    set all(data) {
        this.instances = data || [];
        this.instances.map(item => {
            item.visible = this.getToggle(item.id)
        });

        this.emitChange();
    }

    get all() {
        return this.instances || [];
    }

}

export default new EnvironmentStore();
