import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ConnectorStore from '../../stores/ConnectorStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
import ConnectorForm from './ConnectorForm.react';
let ActionTypes = Constants.ActionTypes;


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
                config: this.state.connector.config
            }
        });
    }

    _getDataForRender() {
        this.state.connector = ConnectorStore.getById(this.props.params.id);
        if(!!!this.state.connector) {
            this.state.connector = {
                name: '',
                config: {}
            }
        }
        return this.state.connector;
    }
}

export default ConnectorUpdateForm;
