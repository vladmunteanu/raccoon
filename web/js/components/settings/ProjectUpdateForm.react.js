import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ProjectStore from '../../stores/ProjectStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
import ProjectForm from './ProjectForm.react';
let ActionTypes = Constants.ActionTypes;


class ProjectUpdateForm extends ProjectForm {
    constructor(props) {
        super(props);
        this.state = {
            project: ProjectStore.getById(this.props.params.id)
        };
    }

    _onChange() {
        this.setState({
            project: ProjectStore.getById(this.props.params.id)
        });
    }

    onSubmit(event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.UPDATE_PROJECT,
            data: {
                id: this.state.project.id,
                name: this.state.project.name,
                details: this.state.project.details
            }
        });
    }

    _getDataForRender() {
        this.state.project = ProjectStore.getById(this.props.params.id);
        if(!!!this.state.project) {
            this.state.project = {
                name: '',
                details: {}
            }
        }
        return this.state.project;
    }
}

export default ProjectUpdateForm;
