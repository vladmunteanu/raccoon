import React from 'react';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import RaccoonApp from '../RaccoonApp.react';
import MethodStore from '../../stores/MethodStore';
import FlowStore from '../../stores/FlowStore';
import { FlowForm } from './FlowForm.react';


function getLocalState() {
    let localState = {
        methods: MethodStore.all,
        flow: {
            name: '',
            steps: [],
            method: ''
        }
    };
    return RaccoonApp.getState(localState);
}

class FlowUpdateForm extends FlowForm {
    constructor(props) {
        super(props);
        this.formName = 'Update flow';
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
        state.flow = FlowStore.getById(this.props.params.id);
        this.setState(state);
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                FlowStore.updateById(this.state.flow.id, {
                    name: this.state.flow.name,
                    steps: this.state.flow.steps,
                    method: this.state.flow.method
                });
            }
        });
    }

    _getDataForRender() {
        this.state.flow = FlowStore.getById(this.props.params.id);
        if(!this.state.flow) {
            this.state.flow = {
                name: '',
                steps: [],
                method: ''
            }
        }
        return this.state.flow;
    }
}

export { FlowUpdateForm };
export default validation(strategy)(FlowUpdateForm);
