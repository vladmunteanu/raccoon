import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ProjectStore from '../../stores/ProjectStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


var Project = React.createClass({
    getInitialState: function() {
        return {
            project: {
                name: '',
                details: {}
            }
        };
    },

    componentDidMount: function() {
        ProjectStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        ProjectStore.removeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({
            project: this.state.project
        });
    },

    _onChangeAuthType: function(event) {
        this.state.project.details.authType = event.target.value;
        this.setState({
            project: this.state.project
        });
    },

    _onChangeName: function(event) {
        this.state.project.name = event.target.value;
        this.setState({
            project: this.state.project
        });
    },

    _onChangeUsername: function(event) {
        this.state.project.details.username = event.target.value;
        this.setState({
            project: this.state.project
        });
    },

    _onChangePassword: function(event) {
        this.state.project.details.password = event.target.value;
        this.setState({
            project: this.state.project
        });
    },

    _onChangeToken: function(event) {
        this.state.project.details.token = event.target.value;
        this.setState({
            project: this.state.project
        });
    },

    onSubmit: function (event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.CREATE_PROJECT,
            data: {
                name: this.state.project.name,
                details: this.state.project.details
            }
        });
    },

    render: function () {
        let name = this.state.project.name;
        let authType = this.state.project.details.authType;
        let username = this.state.project.details.username;
        let password = this.state.project.details.password;
        let token = this.state.project.details.token;


        let githubCredentialsForm = (
            <div>
                <div className="form-group">
                    <label htmlFor="username" className="control-label">Github username</label>
                    <input type="text" className="form-control" onChange={this._onChangeUsername}
                           id="username" value={username} placeholder="Username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="control-label">Github password</label>
                    <input type="password" className="form-control" onChange={this._onChangePassword}
                           id="password" value={password} placeholder="Password"/>
                </div>
            </div>
        );

        if(authType === "oauth")
            githubCredentialsForm = (
                <div className="form-group">
                    <label htmlFor="token" className="control-label">Github token</label>
                    <input type="text" className="form-control" onChange={this._onChangeToken}
                           id="token" value={token} placeholder="Token"/>
                </div>
            );


        return (
            <div className="container">
                <h3>New project</h3>
                <form onSubmit={this.onSubmit} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="project-name" className="control-label">Project name</label>
                        <input type="text"  className="form-control" onChange={this._onChangeName}
                               id="project-name" value={name} placeholder="Project Name"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="git-auth" className="control-label">Git authentication method</label><br/>
                        <select className="form-control" value={authType} id="git-auth" onChange={this._onChangeAuthType}>
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
});

export default Project;
