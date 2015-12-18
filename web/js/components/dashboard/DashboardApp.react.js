import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, History } from 'react-router';

import { GridList, GridTile } from 'material-ui';

import RaccoonApp from '../RaccoonApp.react';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
<<<<<<< HEAD
=======
import AuthStore from '../../stores/AuthStore';
>>>>>>> ab4221bf89f3f77ee0fe3b1f23b35cb4dbdf2c4d

import Sidebar from './Sidebar.react.js';
import Topbar from './../Topbar.react.js';
import Taskbar from './../Taskbar.react.js';
import GridItem from './GridItem.react.js';


<<<<<<< HEAD
=======
function getRaccoonState() {
    return {
        allProjects: ProjectStore.getAll(),
        allEnvironments: EnvironmentStore.getAll(),
        user: AuthStore.me,
    };
}
>>>>>>> ab4221bf89f3f77ee0fe3b1f23b35cb4dbdf2c4d

var DashboardApp = React.createClass({

    getInitialState: function() {
<<<<<<< HEAD
        return RaccoonApp.getState();
    },

    componentDidMount: function() {
=======
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
>>>>>>> ab4221bf89f3f77ee0fe3b1f23b35cb4dbdf2c4d
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
<<<<<<< HEAD
=======
        AuthStore.removeListener(this._onChange);
>>>>>>> ab4221bf89f3f77ee0fe3b1f23b35cb4dbdf2c4d
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    },

    _onChange: function() {
        let state = RaccoonApp.getState();
        this.setState(state);
<<<<<<< HEAD
=======

        if (AuthStore.isLoggedIn()) {
            this.history.pushState(null, '/');
        }
>>>>>>> ab4221bf89f3f77ee0fe3b1f23b35cb4dbdf2c4d
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
