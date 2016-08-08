import React from 'react';

import BaseStore from './BaseStore';

let saltStore = null;


class SaltStore extends BaseStore {

    constructor () {
        if (!saltStore) {
            super();
            saltStore = this;
        } else {
            return saltStore;
        }

        this.baseuri = "/api/v1/salt/"
    }
    
    runCommand() {
        
    }
}
