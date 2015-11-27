import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';

var ProjectStore = require('../stores/ProjectStore');
var EnvironmentStore = require('../stores/EnvironmentStore');

import DashboardApp from './DashboardApp.react';



function getRaccoonState() {
    return {
        allProjects: ProjectStore.getAll(),
        allEnvironments: EnvironmentStore.getAll(),
    };
}

var RaccoonApp = React.createClass({

    getInitialState: function() {
        return getRaccoonState();
    },

    // componentDidMount: function() {
    //     ProjectStore.addChangeListener(this._onChange);
    //     EnvironmentStore.addChangeListener(this._onChange);
    // },

    // componentWillUnmount: function() {
    //     ProjectStore.removeChangeListener(this._onChange);
    //     EnvironmentStore.removeChangeListener(this._onChange);
    // },

    /**
    * @return {object}
    */
    render: function() {
        return (
            <Router>
                <Route path="/" component={DashboardApp}>
                    //<Route path="settings" component={DashboardApp}/>
                    //<Route path="*" component={DashboardApp}/>
                </Route>
            </Router>
        );
    },

    _onChange: function() {
        this.setState(getRaccoonState());
    }

});

module.exports = RaccoonApp;
