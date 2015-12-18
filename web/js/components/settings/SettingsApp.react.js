import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, History } from 'react-router';

import RaccoonApp from '../RaccoonApp.react';

import Sidebar from './Sidebar.react';
import Topbar from './../Topbar.react';
import Taskbar from './../Taskbar.react';

import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';


var SettingsApp = React.createClass({

    getInitialState: function() {
        return RaccoonApp.getState();
    },

    componentDidMount: function() {
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    },

    _onChange: function() {
        let state = RaccoonApp.getState();
        this.setState(state);
    },

    /**
     * @return {object}
     */
    render: function() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <Sidebar allProjects={this.state.allProjects} allEnvironments={this.state.allEnvironments} />
                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
                        <Topbar />
                        <Taskbar />

                        <div className="content">


                        </div>
                    </div>
                </div>
            </div>
        );
    },

});

export default SettingsApp;
