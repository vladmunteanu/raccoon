import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';

import BaseStore from './BaseStore';
import Connector from '../utils/Connector';
import AuthStore from './AuthStore';
import Constants from '../constants/Constants';


let installStore = null;

class InstallStore extends BaseStore {

    constructor() {
        if (!installStore) {
            super();
            installStore = this;
        } else {
            return installStore;
        }

        // set base URI for resources
        this.baseuri = "/api/v1/installs/";

    }

    getLatestInstall(project, env) {
        let installs = this.all.filter(install => {
            return install.project == project.id && install.environment == env.id;
        });

        installs.sort(function(a, b) {
            var x = a.date_added; var y = b.date_added;
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });

        if (installs.length > 0)
            return installs[0];

        return null;
    }
}

export default new InstallStore();
