import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import MethodStore from '../../stores/MethodStore';
import ConnectorStore from '../../stores/ConnectorStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
import MethodForm from './MethodForm.react';
let ActionTypes = Constants.ActionTypes;

function getLocalState(methodId) {
    let localState = {
        connectors: ConnectorStore.all,
        method: MethodStore.getById(methodId)
    };
    return localState;
}

class MethodUpdateForm extends MethodForm {
    constructor(props) {
        super(props);
        this.formName = 'Update method';
        this.state = getLocalState(this.props.params.id);
    }

    _onChange() {
        let state = getLocalState(this.props.params.id);
        this.setState(state);
    }

    onSubmit(event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.UPDATE_METHOD,
            data: {
                id: this.state.method.id,
                name: this.state.method.name,
                connector: this.state.method.connector,
                method: this.state.method.method,
                arguments: this.state.method.arguments
            }
        });
    }

    _getDataForRender() {
        this.state.method = MethodStore.getById(this.props.params.id);
        if(!this.state.method) {
            this.state.method = {
                name: '',
                connector: null,
                method: '',
                arguments: '[]'
            }
        }
        return this.state.method;
    }
}

export default MethodUpdateForm;
