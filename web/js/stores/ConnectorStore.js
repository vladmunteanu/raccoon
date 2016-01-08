import React from 'react';
import FluxStore from 'flux';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';
import Connector from '../utils/Connector';
import BaseStore from './BaseStore';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';


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
    }

}

export default new ConnectorStore();
