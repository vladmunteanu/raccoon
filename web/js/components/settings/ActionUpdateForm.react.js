import React from 'react';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import RaccoonApp from '../RaccoonApp.react';

import ActionStore from '../../stores/ActionStore';
import FlowStore from '../../stores/FlowStore';
import { ActionForm } from './ActionForm.react';


function getLocalState() {
    let localState = {
        flows: FlowStore.all,
        action: {
            name: '',
            label: '',
            placement: 'project',
            project: '',
            environment: '',
            flow: ''
        }
    };
    return RaccoonApp.getState(localState);
}

class ActionUpdateForm extends ActionForm {
    constructor(props) {
        super(props);
        this.formName = 'Update action';
        this.state = getLocalState();
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
        let state = getLocalState();
        state.action = ActionStore.getById(this.props.params.id);
        this.setState(state);
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                ActionStore.updateById(this.state.action.id, {
                    name: this.state.action.name,
                    label: this.state.action.label,
                    placement: this.state.action.placement,
                    project: this.state.action.project,
                    environment: this.state.action.environment,
                    flow: this.state.action.flow
                });
            }
        });
    }

    _getDataForRender() {
        this.state.action = ActionStore.getById(this.props.params.id);
        if(!this.state.action) {
            this.state.action = {
                name: '',
                label: '',
                placement: 'project',
                project: '',
                environment: '',
                flow: '',

            }
        }

        return this.state.action;
    }
}

export { ActionUpdateForm };
export default validation(strategy)(ActionUpdateForm);
