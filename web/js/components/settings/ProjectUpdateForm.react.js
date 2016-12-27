import React from 'react';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import ProjectStore from '../../stores/ProjectStore';
import ConnectorStore from '../../stores/ConnectorStore';
import { ProjectForm } from './ProjectForm.react';


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
                let metadata = this.state.project.metadata;
                try {
                    metadata = metadata || '{}';
                    metadata = typeof metadata !== 'object' ? JSON.parse(metadata) : metadata;
                    ProjectStore.updateById(this.state.project.id, {
                        name: this.state.project.name,
                        label: this.state.project.label,
                        repo_url: this.state.project.repo_url,
                        connector: this.state.project.connector,
                        version: this.state.project.version,
                        metadata: metadata
                    });
                }
                catch (err) {
                    console.log(["Could not create project!", err]);
                }
            }
        });
    }

    _getDataForRender() {
        if(!this.state.project) {
            this.state.project = {
                name: '',
                label: '',
                repo_url: '',
                connector: '',
                version: '',
                metadata: '{}'
            }
        }
        return this.state.project;
    }
}

export { ProjectUpdateForm };
export default validation(strategy)(ProjectUpdateForm);
