import React from 'react';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import MethodStore from '../../stores/MethodStore';
import JenkinsStore from '../../stores/JenkinsStore';
import ConnectorStore from '../../stores/ConnectorStore';
import RaccoonApp from '../RaccoonApp.react';
import { MethodForm } from './MethodForm.react';


function getLocalState(methodId) {
    let localState = {
        connectors: ConnectorStore.all,
        jobs: JenkinsStore.jobs,
        method: MethodStore.getById(methodId),
        rowCount: 0
    };
    if (localState.method){
        localState.rowCount = localState.method.arguments.length;
    }
    return localState;
}

class MethodUpdateForm extends MethodForm {
    constructor(props) {
        super(props);
        this.formName = 'Update job';
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
                MethodStore.updateById(this.state.method.id, {
                    name: this.state.method.name,
                    connector: this.state.method.connector,
                    method: this.state.method.method,
                    arguments: this.state.method.arguments
                });
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
                arguments: []
            }
        }
        return this.state.method;
    }
}

export { MethodUpdateForm };
export default validation(strategy)(MethodUpdateForm);
