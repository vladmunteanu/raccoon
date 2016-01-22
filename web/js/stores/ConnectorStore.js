import React from 'react';
import FluxStore from 'flux';
import assign from 'object-assign';


import AppDispatcher from '../dispatcher/AppDispatcher';
import Connector from '../utils/Connector';
import BaseStore from './BaseStore';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';

let ActionTypes = Constants.ActionTypes;
let connectorStore = null;

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

        // register actions
        AppDispatcher.registerOnce(ActionTypes.CONNECTOR_TOGGLE_VISIBLE, payload => {
            this.toggleVisible(payload.data.id);
        });
        AppDispatcher.registerOnce(ActionTypes.UPDATE_CONNECTOR, payload => {
            this.updateById(payload.data.id, payload.data);
        });
        AppDispatcher.registerOnce(ActionTypes.CREATE_CONNECTOR, payload => {
            this.create(payload.data);
        });
    }

}

export default new ConnectorStore();
