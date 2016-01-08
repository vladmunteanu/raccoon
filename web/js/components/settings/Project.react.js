import React from 'react';
import ProjectStore from '../../stores/ProjectStore';
import RaccoonApp from '../RaccoonApp.react';


var Project = React.createClass({
    getInitialState: function() {
        let project = ProjectStore.getById(this.props.params.id);
        if(!!!project)
            project = {
                name: ''
            };
        console.log("initial", this.props.params.id);

        return {
            project: project,
        };
    },

    componentDidMount: function() {
        console.log("mount", this.props.params.id);
        ProjectStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        ProjectStore.removeListener(this._onChange);
    },

    _onChange: function() {
        let project = ProjectStore.getById(this.props.params.id);
        if(!!!project)
            project = {
                name: ''
            };

        this.setState({
            project: project
        });
        console.log(this.props.params.id);
    },

    render: function () {
        return (
            <div className="container">
                <h3>Project details</h3>
                <form className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="project-name" className="control-label">Project name</label>
                        <input type="text"  className="form-control"
                               id="project-name" value={this.state.project.name} placeholder="Project Name"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="git-auth" className="control-label">Git authentication method</label><br/>
                        <select className="form-control" id="git-auth">
                            <option>Basic</option>
                            <option>OAuth</option>
                        </select>
                    </div>
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
                    <div className="form-group">
                        <label htmlFor="token" className="control-label">Github token</label>
                        <input type="text" className="form-control"
                               id="token" placeholder="Token"/>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>

        );
    }
});

export default Project;
