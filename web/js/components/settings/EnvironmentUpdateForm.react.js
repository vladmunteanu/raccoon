import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import EnvironmentStore from '../../stores/EnvironmentStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
import EnvironmentForm from './EnvironmentForm.react';
let ActionTypes = Constants.ActionTypes;


class EnvironmentUpdateForm extends EnvironmentForm {
    constructor(props) {
        super(props);
        this.formName = 'Update environment';
        this.state = {
            environment: EnvironmentStore.getById(this.props.params.id)
        };
    }

    _onChange() {
        this.setState({
            environment: EnvironmentStore.getById(this.props.params.id)
        });
    }

    onSubmit(event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.UPDATE_ENVIRONMENT,
            data: {
                id: this.state.environment.id,
                name: this.state.environment.name
            }
        });
    }

    _getDataForRender() {
        this.state.environment = EnvironmentStore.getById(this.props.params.id);
        if(!this.state.environment) {
            this.state.environment = {
                name: ''
            }
        }
        return this.state.environment;
    }
}

export default EnvironmentUpdateForm;
