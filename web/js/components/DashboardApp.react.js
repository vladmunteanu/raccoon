import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';

import { GridList, GridTile } from 'material-ui';

import ProjectStore from '../stores/ProjectStore';
import EnvironmentStore from '../stores/EnvironmentStore';

import Sidebar from './Sidebar.react';
import Topbar from './Topbar.react';
import Taskbar from './Taskbar.react';
import GridItem from './GridItem.react';


function getRaccoonState() {
    return {
        allProjects: ProjectStore.getAll(),
        allEnvironments: EnvironmentStore.getAll(),
    };
}

var DashboardApp = React.createClass({

    getInitialState: function() {
        ProjectStore.fetchAll();
        EnvironmentStore.fetchAll();

        return getRaccoonState();
    },

    componentDidMount: function() {
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        ProjectStore.removeChangeListener(this._onChange);
        EnvironmentStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        let state = getRaccoonState();
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
