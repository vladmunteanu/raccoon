/**
 * Created by mdanilescu on 15/01/2019.
 */
import React from 'react';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import RightStore from '../../stores/RightStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import { RightForm } from './RightForm.react.js';


function getLocalState(rightId) {
    let localState = {
        projects: ProjectStore.all,
        environments: EnvironmentStore.all,
        right: {
            name: '',
            projects: [],
            environments: []
        }
    };

    if ( rightId ) {
        localState.right = RightStore.getById(rightId);
    }

    return localState;
}

class RightUpdateForm extends RightForm {
    constructor(props) {
        super(props);
        this.formName = 'Update Right';
        this.state = getLocalState(this.props.params.id);
        this.onSubmit = this.onSubmit.bind(this);
        this._onChange = this._onChange.bind(this);
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
                RightStore.updateById(this.state.right.id, {
                    name: this.state.right.name,
                    projects: this.state.right.projects,
                    environments: this.state.right.environments
                });
            }
        });
    }

    _getDataForRender() {
        this.state.right = RightStore.getById(this.props.params.id);
        if(!this.state.right) {
            this.state.right = {
                name: '',
                projects: [],
                environments: []
            }
        }

        return this.state.right;
    }
}

export { RightUpdateForm };
export default validation(strategy)(RightUpdateForm);
