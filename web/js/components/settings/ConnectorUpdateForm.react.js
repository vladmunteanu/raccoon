import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ConnectorStore from '../../stores/ConnectorStore';
import Constants from '../../constants/Constants';
import ConnectorForm from './ConnectorForm.react';
import localConf from '../../config/Config'
import RaccoonApp from '../RaccoonApp.react';
let ActionTypes = Constants.ActionTypes;
let data = localConf.CONNECTOR_TYPE;

class ConnectorUpdateForm extends ConnectorForm {
    constructor(props) {
        super(props);
        this.formName = 'Update connector';
        this.state = {
            connector: ConnectorStore.getById(this.props.params.id)
        };
    }

    _onChange() {
        this.setState({
            connector: ConnectorStore.getById(this.props.params.id)
        });
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
                config: JSON.stringify(data[Object.keys(data)[0]], undefined, 4)
            }
        }
        return this.state.connector;
    }
}

export default ConnectorUpdateForm;
