import React from 'react';

import BaseStore from './BaseStore';


let flowStore = null;

class FlowStore extends BaseStore {

    constructor() {
        if (!flowStore) {
            super();
            flowStore = this;
        } else {
            return flowStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/flows/";
    }
}

export default new FlowStore();
