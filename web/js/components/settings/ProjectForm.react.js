import React from 'react';

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

    onSubmit(event) {
        event.preventDefault();
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

    render() {
        let project = this._getDataForRender();
        let name = project.name;
        let label = project.label;
        let url = project.repo_url;
        let repoType = project.repo_type || '';
        let authType = project.repo_auth.auth_type || '';
        let username = project.repo_auth.username || '';
        let password = project.repo_auth.password || '';
        let token = project.repo_auth.token || '';

        let githubCredentialsForm = (
            <div>
                <div className="form-group">
                    <label htmlFor="username" className="control-label">Github username</label>
                    <input type="text" className="form-control" onChange={this._onChangeUsername.bind(this)}
                           id="username" value={username} placeholder="Username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="control-label">Github password</label>
                    <input type="password" className="form-control" onChange={this._onChangePassword.bind(this)}
                           id="password" value={password} placeholder="Password"/>
                </div>
            </div>
        );

        if(authType === "oauth")
            githubCredentialsForm = (
                <div className="form-group">
                    <label htmlFor="token" className="control-label">Github token</label>
                    <input type="text" className="form-control" onChange={this._onChangeToken.bind(this)}
                           id="token" value={token} placeholder="Token"/>
                </div>
            );

        let connectorId = project.connector;

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit.bind(this)} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="project-name" className="control-label">Project name</label>
                        <input type="text"  className="form-control" onChange={this._onChangeName.bind(this)}
                               id="project-name" value={name} placeholder="Project Name"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="project-label" className="control-label">Project label</label>
                        <input type="text"  className="form-control" onChange={this._onChangeLabel.bind(this)}
                               id="project-label" value={label} placeholder="Project label"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="repo-url" className="control-label">Repository url</label>
                        <input type="text"  className="form-control" onChange={this._onChangeRepoUrl.bind(this)}
                               id="repo-url" value={url} placeholder="Repository url"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="connector-project" className="control-label">Connector</label>
                        <select className="form-control" id="connector-project" value={connectorId} onChange={this._onChangeConnector.bind(this)}>
                            <option disabled>-- select an option --</option>
                            {
                                this.state.connectors.map(connector => {
                                    return <option key={connector.id} value={connector.id}>{connector.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default ProjectForm;

