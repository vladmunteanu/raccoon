import React from 'react';
import ProjectStore from '../../stores/ProjectStore';
import RaccoonApp from '../RaccoonApp.react';


var Project = React.createClass({
    getInitialState: function() {
        let project = ProjectStore.getById(this.props.params.id);
        return {
            project: project,
            authType: "basic"
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
        let isBasicAuth = event.target.value === "basic";
        this.setState({
            authType: isBasicAuth ? "basic" : "oauth"
        });
    },

    render: function () {
        let project = ProjectStore.getById(this.props.params.id);
        let githubCredentialsForm = (
            <div>
                <div className="form-group">
                    <label htmlFor="username" className="control-label">Github username</label>
                    <input type="text" className="form-control"
                           id="username" placeholder="Username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="control-label">Github password</label>
                    <input type="password" className="form-control"
                           id="password" placeholder="Password"/>
                </div>
            </div>
        );

        if(this.state.authType === "oauth")
            githubCredentialsForm = (
                <div className="form-group">
                    <label htmlFor="token" className="control-label">Github token</label>
                    <input type="text" className="form-control"
                           id="token" placeholder="Token"/>
                </div>
            );

        if(!!project)
            return (
                <div className="container">
                    <h3>Project details</h3>
                    <form className="form-horizontal col-sm-4">
                        <div className="form-group">
                            <label htmlFor="project-name" className="control-label">Project name</label>
                            <input type="text"  className="form-control"
                                   id="project-name" value={project.name} placeholder="Project Name"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="git-auth" className="control-label">Git authentic ation method</label><br/>
                            <select className="form-control" id="git-auth" ref="auth-method" onChange={this._onChangeAuthType}>
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
