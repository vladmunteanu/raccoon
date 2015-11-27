import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';

import ProjectStore from '../stores/ProjectStore';
import EnvironmentStore from '../stores/EnvironmentStore';


function getRaccoonState() {
    return {
        allProjects: ProjectStore.getAll(),
        allEnvironments: EnvironmentStore.getAll(),
    };
}

var DashboardApp = React.createClass({

    getInitialState: function() {
        ProjectStore.fetchAll();

        return getRaccoonState();
    },

    componentDidMount: function() {
        ProjectStore.addListener(this._onChange);
        // EnvironmentStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        ProjectStore.removeChangeListener(this._onChange);
        // EnvironmentStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getRaccoonState());
    },

    /**
    * @return {object}
    */
    render: function() {
        return (
            <div>
                <h1>Hello from the other side!</h1>
                <ul>
                    {this.state.allProjects.map(function(project) {
                      return <li key={project.name}>{project.name}</li>;
                    })}
                </ul>
            </div>
        );
    },

});

module.exports = DashboardApp;
