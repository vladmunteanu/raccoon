import React from 'react';

import BaseStore from './BaseStore';

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
