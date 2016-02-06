import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ConnectorStore from '../../stores/ConnectorStore';
import Constants from '../../constants/Constants';
import ConnectorForm from './ConnectorForm.react';
import localConf from '../../config/Config'
import RaccoonApp from '../RaccoonApp.react';
let ActionTypes = Constants.ActionTypes;
let ConnectorType = localConf.CONNECTOR_TYPE;

function getLocalState(connectorId) {
    let localState = {
        connector: ConnectorStore.getById(connectorId)
    };
    return localState;
}

class ConnectorUpdateForm extends ConnectorForm {
    constructor(props) {
        super(props);
        this.formName = 'Update connector';
        this.state = getLocalState(this.props.params.id);
    }

    _onChange() {
        let state = getLocalState(this.props.params.id);
        this.setState(state);
    }

    onSubmit(event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.UPDATE_CONNECTOR,
            data: {
                id: this.state.connector.id,
                name: this.state.connector.name,
                type: this.state.connector.type,
                config: JSON.parse(this.state.connector.config)
            }
        });
    }

    _getDataForRender() {
        this.state.connector = ConnectorStore.getById(this.props.params.id);
        if(!this.state.connector) {
            this.state.connector = {
                name: '',
                type: 'git',
                config: JSON.stringify(ConnectorType[Object.keys(ConnectorType)[0]], undefined, 4)
            }
        }
        return this.state.connector;
    }
}

export default ConnectorUpdateForm;
