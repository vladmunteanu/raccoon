import React from 'react';

import RaccoonApp from '../RaccoonApp.react';
import AppDispatcher from '../../dispatcher/AppDispatcher';

import ActionStore from '../../stores/ActionStore';
import MethodStore from '../../stores/MethodStore';
import ActionForm from './ActionForm.react';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


function getLocalState() {
    let localState = {
        methods: MethodStore.all,
        action: {
            name: '',
            label: '',
            project: null,
            environment: null,
            method: null,
        }
    };
    return RaccoonApp.getState(localState);
}

class ActionUpdateForm extends ActionForm {
    constructor(props) {
        super(props);
        this.formName = 'Update action';
        this.state = getLocalState();
    }

    _onChange() {
        let state = getLocalState();
        state.action = ActionStore.getById(this.props.params.id);
        this.setState(state);
    }

    onSubmit(event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.UPDATE_ACTION,
            data: {
                id: this.state.action.id,
                name: this.state.action.name,
                label: this.state.action.label,
                project: this.state.action.project,
                environment: this.state.action.environment,
                method: this.state.action.method,
            }
        });
    }

    _getDataForRender() {
        this.state.action = ActionStore.getById(this.props.params.id);
        if(!this.state.action) {
            this.state.action = {
                name: '',
                label: '',
                project: null,
                environment: null,
                method: null,

            }
        }

        return this.state.action;
    }
}

export default ActionUpdateForm;
