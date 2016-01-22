import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ProjectStore from '../../stores/ProjectStore';
import ConnectorStore from '../../stores/ConnectorStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
import ProjectForm from './ProjectForm.react';
let ActionTypes = Constants.ActionTypes;

function getLocalState(projectId) {
    let localState = {
        connectors: ConnectorStore.all,
        project: ProjectStore.getById(projectId)
    };
    return localState;
}

class ProjectUpdateForm extends ProjectForm {
    constructor(props) {
        super(props);
        this.formName = 'Update project';
        this.state = getLocalState(this.props.params.id);
    }

    _onChange() {
        let state = getLocalState(this.props.params.id);
        this.setState(state);
    }

    onSubmit(event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.UPDATE_PROJECT,
            data: {
                id: this.state.project.id,
                name: this.state.project.name,
                label: this.state.project.label,
                repo_url: this.state.project.repo_url,
                connector: this.state.project.connector
            }
        });
    }

    _getDataForRender() {
        this.state.project = ProjectStore.getById(this.props.params.id);
        if(!this.state.project) {
            this.state.project = {
                name: '',
                label: '',
                repo_url: '',
                connector: null
            }
        }
        return this.state.project;
    }
}

export default ProjectUpdateForm;
