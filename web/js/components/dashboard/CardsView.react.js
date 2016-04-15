import React from 'react';
import { render } from 'react-dom';

import RaccoonApp from '../RaccoonApp.react';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import AuthStore from '../../stores/AuthStore';
import ActionStore from '../../stores/ActionStore';

import Sidebar from './Sidebar.react';
import Topbar from './../Topbar.react';
import Taskbar from './../Taskbar.react';
import GridItem from './GridItem.react';
import Notification from '../Notification.react';


var CardsView = React.createClass({

    getInitialState: function() {
        return RaccoonApp.getState();
    },

    componentDidMount: function() {
        AuthStore.addListener(this._onChange);
        ActionStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        AuthStore.removeListener(this._onChange);
        ActionStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    },

    _onChange: function() {
        let state = RaccoonApp.getState();
        this.setState(state);
    },

    render: function() {
        return (
            <div>
                {
                    this.state.projects.map(project => {
                        if (project.visible) {
                            return (
                                <div className="container-fluid grid-list">
                                    {
                                        this.state.environments.map(environment => {
                                            if (environment.visible) {
                                                return <GridItem
                                                    key={project.id + '-' + environment.id}
                                                    project={project}
                                                    environment={environment}/>;
                                            }
                                        })
                                    }
                                </div>
                            );
                        }
                    })
                }
            </div>
        );
    }

});

export default CardsView;
