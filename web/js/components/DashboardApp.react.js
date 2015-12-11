import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, History } from 'react-router';

import { GridList, GridTile } from 'material-ui';

import ProjectStore from '../stores/ProjectStore';
import EnvironmentStore from '../stores/EnvironmentStore';
import LoginStore from '../stores/LoginStore';

import Sidebar from './Sidebar.react';
import Topbar from './Topbar.react';
import Taskbar from './Taskbar.react';
import GridItem from './GridItem.react';


function getRaccoonState() {
    return {
        allProjects: ProjectStore.getAll(),
        allEnvironments: EnvironmentStore.getAll(),
        user: LoginStore.me,
    };
}

var DashboardApp = React.createClass({
    mixins: [ History ],

    getInitialState: function() {
        LoginStore.fetchMe();
        ProjectStore.fetchAll();
        EnvironmentStore.fetchAll();

        return getRaccoonState();
    },

    componentWillMount: function () {
        if (!LoginStore.isLoggedIn()) {
            this.history.pushState(null, '/login');
        }
    },

    componentDidMount: function() {
        LoginStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        LoginStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    },

    _onChange: function() {
        let state = getRaccoonState();

        this.setState(state);

        if (LoginStore.isLoggedIn()) {
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
