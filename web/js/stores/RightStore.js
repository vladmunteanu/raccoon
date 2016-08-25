import React from 'react';
import { EventEmitter } from 'events';

import BaseStore from './BaseStore';


let rightStore = null;

class RightStore extends BaseStore {

    constructor() {
        if (!rightStore) {
            super();
            rightStore = this;
        } else {
            return rightStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/rights/";

        //register BaseStore actions
        this.registerActions();
    }

}

export default new RightStore();
