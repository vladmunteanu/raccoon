import React from 'react';

import BaseStore from './BaseStore';
import WebSocketConnection from '../utils/WebSocketConnection';

let saltStore = null;


class SaltStore extends BaseStore {

    constructor () {
        if (!saltStore) {
            super();
            saltStore = this;
        } else {
            return saltStore;
        }

        this.baseuri = "/api/v1/salt/";
        this._conf = null;
        this._saveInProgress = false;
    }

    isSaveInProgress()  {
        return this._saveInProgress;
    }

    get config() {
        return this._conf;
    }

    getConfig(connectorId, project, environment, branch) {
        let wsConnection = new WebSocketConnection();

        wsConnection.send({
            verb: 'post',
            resource: this.baseuri + 'run',
            body: {
                fun: 'oeconfig2.getconfig',
                service_type: project.name,
                target_env: environment.name,
                git_branch: branch,
                connectorId: connectorId
            }
        }, payload => {
            console.log(payload);
            this._conf = payload.data.return[0];
            this.emitChange();
        });
    }
    
    setConfig(connectorId, project, environment, branch, configData) {
        let wsConnection = new WebSocketConnection();

        this._saveInProgress = true;
        this.emitChange();

        let mes = {
            verb: 'post',
            resource: this.baseuri + 'run',
            body: {
                fun: 'oeconfig2.setconfig',
                service_type: project.name,
                target_env: environment.name,
                git_branch: branch,
                config_data: window.btoa(configData),
                connectorId: connectorId
            }
        };

        wsConnection.send(mes, payload => {
            if (payload.hasOwnProperty('code')) {
                if (payload.code != 200) {
                    console.log("Save config failed!");
                }
                else {
                    console.log("Successfully saved config!")
                }
            }
            console.log(["Save config result: ", payload]);
            this._saveInProgress = false;
            this.emitChange();
        }, true);
    }
}

export default new SaltStore();
