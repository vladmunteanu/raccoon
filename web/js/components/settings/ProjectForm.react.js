import React from 'react';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ProjectStore from '../../stores/ProjectStore';
import ConnectorStore from '../../stores/ConnectorStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;

function getLocalState() {
    let localState = {
        connectors: ConnectorStore.all,
        project: {
            name: '',
            label: '',
            repo_url: '',
            connector: null
        }
    };
    return localState;
}


class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New project';
        this.state = getLocalState();
        this.validatorTypes = {
            name: Joi.string().min(3).max(50).required().label('Project name'),
            label: Joi.string().min(3).max(50).required().label('Project label'),
            repo_url: Joi.string().uri({
                scheme: ['http', 'https']
            }).required().label('Repository url'),
            connector: Joi.any().disallow(null, '').required().label('Connector')
        };
        this.getValidatorData = this.getValidatorData.bind(this);
        this.renderHelpText = this.renderHelpText.bind(this);
        this._onChangeName =  this._onChangeName.bind(this);
        this._onChangeLabel =  this._onChangeLabel.bind(this);
        this._onChangeRepoUrl =  this._onChangeRepoUrl.bind(this);
        this._onChangeConnector =  this._onChangeConnector.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        ProjectStore.addListener(this._onChange.bind(this));
        ConnectorStore.addListener(this._onChange.bind(this));
    }

    componentWillUnmount() {
        ProjectStore.removeListener(this._onChange.bind(this));
        ConnectorStore.removeListener(this._onChange.bind(this));
    }

    _onChange() {
        let state = getLocalState();
        state.project = this.state.project;
        this.setState(state);
    }

    _onChangeName(event) {
        this.state.project.name = event.target.value;
        this.setState({
            project: this.state.project
        });
    }

    _onChangeLabel(event) {
        this.state.project.label = event.target.value;
        this.setState({
            project: this.state.project
        });
    }

    _onChangeRepoUrl(event) {
        this.state.project.repo_url = event.target.value;
        this.setState({
            project: this.state.project
        });
    }

    _onChangeConnector(event) {
        this.state.project.connector = event.target.value;
        this.setState({
            project: this.state.project
        });
    }

    _getDataForRender() {
        return this.state.project;
    }

    getValidatorData() {
        return this.state.project;
    }

    renderHelpText(messages) {
        return (
            <div className="text-danger">
                {
                    messages.map(message => {
                        return <div>{message}</div>
                    })
                }
            </div>
        );
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                AppDispatcher.dispatch({
                    action: ActionTypes.CREATE_PROJECT,
                    data: {
                        name: this.state.project.name,
                        label: this.state.project.label,
                        repo_url: this.state.project.repo_url,
                        connector: this.state.project.connector
                    }
                });
            }
        });
    }

    render() {
        let project = this._getDataForRender();
        let name = project.name;
        let label = project.label;
        let url = project.repo_url;
        let connectorId = project.connector;

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="project-name" className="control-label">Project name</label>
                        <input type="text" className="form-control"
                               id="project-name" value={name}
                               placeholder="Project Name"
                               onChange={this._onChangeName}
                               onBlur={this.props.handleValidation('name')}/>
                        {this.renderHelpText(this.props.getValidationMessages('name'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="project-label" className="control-label">Project label</label>
                        <input type="text"  className="form-control"
                               id="project-label" value={label}
                               placeholder="Project label"
                               onChange={this._onChangeLabel}
                               onBlur={this.props.handleValidation('label')}/>
                        {this.renderHelpText(this.props.getValidationMessages('label'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="repo-url" className="control-label">Repository url</label>
                        <input type="text"  className="form-control"
                               id="repo-url" value={url}
                               placeholder="Repository url"
                               onChange={this._onChangeRepoUrl}
                               onBlur={this.props.handleValidation('repo_url')}/>
                        {this.renderHelpText(this.props.getValidationMessages('repo_url'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="connector-project" className="control-label">Connector</label>
                        <select className="form-control" id="connector-project"
                                value={connectorId}
                                onChange={this._onChangeConnector}
                                onBlur={this.props.handleValidation('connector')}>
                            <option disabled>-- select an option --</option>
                            {
                                this.state.connectors.map(connector => {
                                    return <option key={connector.id} value={connector.id}>{connector.name}</option>
                                })
                            }
                        </select>
                        {this.renderHelpText(this.props.getValidationMessages('connector'))}
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>
        );
    }
}

export { ProjectForm };
export default validation(strategy)(ProjectForm);

