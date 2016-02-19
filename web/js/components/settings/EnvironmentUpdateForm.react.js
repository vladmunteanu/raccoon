import React from 'react';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import EnvironmentStore from '../../stores/EnvironmentStore';
import RaccoonApp from '../RaccoonApp.react';
import { EnvironmentForm } from './EnvironmentForm.react';


class EnvironmentUpdateForm extends EnvironmentForm {
    constructor(props) {
        super(props);
        this.formName = 'Update environment';
        this.state = {
            environment: EnvironmentStore.getById(this.props.params.id)
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    _onChange() {
        this.setState({
            environment: EnvironmentStore.getById(this.props.params.id)
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id != this.props.params.id) {
            this.props.clearValidations();
            this.setState({
                environment: EnvironmentStore.getById(nextProps.params.id)
            });
        }
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.clearValidations();
        this.props.validate((error) => {
            if (!error) {
                EnvironmentStore.updateById(this.state.environment.id, {
                    name: this.state.environment.name
                });
            }
        });
    }

    _getDataForRender() {
        if(!this.state.environment) {
            this.state.environment = {
                name: ''
            }
        }
        return this.state.environment;
    }
}

export { EnvironmentUpdateForm };
export default validation(strategy)(EnvironmentUpdateForm);
