import React from 'react';
import FluxStore from 'flux';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import AppDispatcher from '../dispatcher/AppDispatcher';

import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';


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
