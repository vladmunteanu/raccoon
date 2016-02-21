import React from 'react';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import ConnectorStore from '../../stores/ConnectorStore';
import { ConnectorForm } from './ConnectorForm.react';
import localConf from '../../config/Config'
import RaccoonApp from '../RaccoonApp.react';
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
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id != this.props.params.id) {
            this.props.clearValidations();
            let state = getLocalState(nextProps.params.id);
            this.setState(state);
        }
    }

    _onChange() {
        let state = getLocalState(this.props.params.id);
        this.setState(state);
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                ConnectorStore.updateById(this.state.connector.id, {
                    name: this.state.connector.name,
                    type: this.state.connector.type,
                    config: JSON.parse(this.state.connector.config)
                });
            }
        });
    }

    _getDataForRender() {
        this.state.connector = ConnectorStore.getById(this.props.params.id);
        if(!this.state.connector) {
            let defaultKey = Object.keys(ConnectorType)[0];
            this.state.connector = {
                name: '',
                type: defaultKey,
                config: JSON.stringify(ConnectorType[defaultKey], undefined, 4)
            }
        }
        return this.state.connector;
    }
}

export { ConnectorUpdateForm };
export default validation(strategy)(ConnectorUpdateForm);