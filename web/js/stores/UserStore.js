import React from 'react';
import { EventEmitter } from 'events';

import BaseStore from './BaseStore';


let userStore = null;

class UserStore extends BaseStore {

    constructor() {
        if (!userStore) {
            super();
            userStore = this;
        } else {
            return userStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/users/";

        //register BaseStore actions
        this.registerActions();
    }

}

export default new UserStore();
