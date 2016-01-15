import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ProjectStore from '../../stores/ProjectStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New project';
        this.state = {
            project: {
                name: '',
                label: '',
                repo_url: '',
                repo_type: 'GIT',
                repo_auth: {}
            }
        };
    }

    componentDidMount() {
        ProjectStore.addListener(this._onChange.bind(this));
    }

    componentWillUnmount() {
        ProjectStore.removeListener(this._onChange.bind(this));
    }

    _onChange() {
    }

    _onChangeAuthType(event) {
        this.state.project.repo_auth.auth_type = event.target.value;
        this.setState({
            project: this.state.project
        });
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

    _onChangeRepoType(event) {
        this.state.project.repo_type = event.target.value;
        this.setState({
            project: this.state.project
        });
    }

    _onChangeUsername(event) {
        this.state.project.repo_auth.username = event.target.value;
        this.setState({
            project: this.state.project
        });
    }

    _onChangePassword(event) {
        this.state.project.repo_auth.password = event.target.value;
        this.setState({
            project: this.state.project
        });
    }

    _onChangeToken(event) {
        this.state.project.repo_auth.token = event.target.value;
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
                repo_type: this.state.project.repo_type,
                repo_auth: this.state.project.details
            }
        });
    }

    render() {
        let project = this._getDataForRender();
        let name = project.name;
        let label = project.label;
        let url = project.repo_url;
        let repoType = project.repo_type;
        let authType = project.repo_auth.auth_type;
        let username = project.repo_auth.username;
        let password = project.repo_auth.password;
        let token = project.repo_auth.token;

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
                        <label htmlFor="repo-type" className="control-label">Repository type</label><br/>
                        <select className="form-control" value={repoType} id="repo-type" onChange={this._onChangeRepoType.bind(this)}>
                            <option value="git">GIT</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="git-auth" className="control-label">Git authentication method</label><br/>
                        <select className="form-control" value={authType} id="git-auth" onChange={this._onChangeAuthType.bind(this)}>
                            <option value="basic">Basic</option>
                            <option value="oauth">OAuth</option>
                        </select>
                    </div>
                    {githubCredentialsForm}
                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default ProjectForm;

