import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, History } from 'react-router';

import { GridList, GridTile } from 'material-ui';

import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import AuthStore from '../../stores/AuthStore';

import Sidebar from './Sidebar.react.js';
import Topbar from './../Topbar.react.js';
import Taskbar from './../Taskbar.react.js';
import GridItem from './GridItem.react.js';


function getRaccoonState() {
    return {
        allProjects: ProjectStore.getAll(),
        allEnvironments: EnvironmentStore.getAll(),
        user: AuthStore.me,
    };
}

var DashboardApp = React.createClass({
    mixins: [ History ],

    getInitialState: function() {
        AuthStore.fetchMe();
        ProjectStore.fetchAll();
        EnvironmentStore.fetchAll();

        return getRaccoonState();
    },

    componentWillMount: function () {
        if (!AuthStore.isLoggedIn()) {
            this.history.pushState(null, '/login');
        }
    },

    componentDidMount: function() {
        AuthStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        AuthStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    },

    _onChange: function() {
        let state = getRaccoonState();

        this.setState(state);

        if (AuthStore.isLoggedIn()) {
            this.history.pushState(null, '/');
        }
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

                            {
                                this.state.allProjects.map(project => {
                                    if (project.visible) {
                                        return (
                                            <div className="container-fluid grid-list">
                                                {
                                                    this.state.allEnvironments.map(environment => {
                                                        if (environment.visible) {
                                                            return <GridItem project={project}
                                                                             environment={environment}/>
                                                        }
                                                    })
                                                }
                                            </div>
                                        );
                                    }
                                })
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    },

});

export default DashboardApp;
