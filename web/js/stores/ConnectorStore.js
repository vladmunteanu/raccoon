import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';
import BaseStore from './BaseStore';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;
let connectorStore = null;
let connectorTypes = {};

class ConnectorStore extends BaseStore {

    constructor() {
        if (!connectorStore) {
            super();
            connectorStore = this;
        } else {
            return connectorStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/connectors/";

        //register BaseStore actions
        this.registerActions();

        // register actions
        AppDispatcher.registerOnce(ActionTypes.CONNECTOR_TOGGLE_VISIBLE, payload => {
            this.toggleVisible(payload.data.id);
        });
    }

    register(name, store, publicMethods) {
        connectorTypes[name] = {
            store: store,
            methods: publicMethods
        };
    }

    get types() {
        return connectorTypes;
    }

}

export default new ConnectorStore();
