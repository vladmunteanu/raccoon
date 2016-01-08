import React from 'react';
import ProjectStore from '../../stores/ProjectStore';
import RaccoonApp from '../RaccoonApp.react';


var Project = React.createClass({
    getInitialState: function() {
        let project = ProjectStore.getById(this.props.params.id);
        return {
            project: project,
            details: {
                authType: "basic"
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
        let project = ProjectStore.getById(this.props.params.id);
        this.setState({
            project: project
        });
    },

    _onChangeAuthType: function(event) {
        let details = this.state.details;
        details.authType = event.target.value;
        this.setState({
            details: details
        });
    },

    _onChangeName: function(event) {
        this.state.project.name = event.target.value;
        this.setState({
            name: event.target.value
        });
    },

    _onChangeUsername: function(event) {
        let details = this.state.details;
        details.username = event.target.value;
        this.setState({
            details: details
        });
    },

    _onChangePassword: function(event) {
        let details = this.state.details;
        details.password = event.target.value;
        this.setState({
            details: details
        });
    },

    _onChangeToken: function(event) {
        let details = this.state.details;
        details.token = event.target.value;
        this.setState({
            details: details
        });
    },

    onSubmit: function (event) {
        event.preventDefault();
        console.log({
            name: !!this.state.name ? this.state.name : this.state.project.name,
            details: this.state.details
        });
        //AppDispatcher.dispatch({
        //    action: ActionTypes.REGISTER_USER,
        //    data: this.state
        //});
    },

    render: function () {
        this.state.project = ProjectStore.getById(this.props.params.id);
        let githubCredentialsForm = (
            <div>
                <div className="form-group">
                    <label htmlFor="username" className="control-label">Github username</label>
                    <input type="text" className="form-control" onChange={this._onChangeUsername}
                           id="username" placeholder="Username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="control-label">Github password</label>
                    <input type="password" className="form-control" onChange={this._onChangePassword}
                           id="password" placeholder="Password"/>
                </div>
            </div>
        );

        if(this.state.details.authType === "oauth")
            githubCredentialsForm = (
                <div className="form-group">
                    <label htmlFor="token" className="control-label">Github token</label>
                    <input type="text" className="form-control" onChange={this._onChangeToken}
                           id="token" placeholder="Token"/>
                </div>
            );

        if(!!this.state.project)
            return (
                <div className="container">
                    <h3>Project details</h3>
                    <form onSubmit={this.onSubmit} className="form-horizontal col-sm-4">
                        <div className="form-group">
                            <label htmlFor="project-name" className="control-label">Project name</label>
                            <input type="text"  className="form-control" onChange={this._onChangeName}
                                   id="project-name" value={this.state.project.name} placeholder="Project Name"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="git-auth" className="control-label">Git authentication method</label><br/>
                            <select className="form-control" id="git-auth" onChange={this._onChangeAuthType}>
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

        return <div></div>
    }
});

export default Project;
