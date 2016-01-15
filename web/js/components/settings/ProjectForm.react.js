import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ProjectStore from '../../stores/ProjectStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {
                name: '',
                details: {}
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
        this.setState({
            project: this.state.project
        });
    }

    _onChangeAuthType(event) {
        this.state.project.details.authType = event.target.value;
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

    _onChangeUsername(event) {
        this.state.project.details.username = event.target.value;
        this.setState({
            project: this.state.project
        });
    }

    _onChangePassword(event) {
        this.state.project.details.password = event.target.value;
        this.setState({
            project: this.state.project
        });
    }

    _onChangeToken(event) {
        this.state.project.details.token = event.target.value;
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
                details: this.state.project.details
            }
        });
    }

    render() {
        let project = this._getDataForRender();
        let name = project.name;
        let authType = project.details.authType;
        let username = project.details.username;
        let password = project.details.password;
        let token = project.details.token;

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
                <h3>New project new</h3>
                <form onSubmit={this.onSubmit.bind(this)} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="project-name" className="control-label">Project name</label>
                        <input type="text"  className="form-control" onChange={this._onChangeName.bind(this)}
                               id="project-name" value={name} placeholder="Project Name"/>
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

