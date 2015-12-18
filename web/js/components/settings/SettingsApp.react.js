import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, History } from 'react-router';

import RaccoonApp from '../RaccoonApp.react';

import Sidebar from './Sidebar.react';
import Topbar from './../Topbar.react';
import Taskbar from './../Taskbar.react';

import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import ConnectorStore from '../../stores/ConnectorStore';
import UserStore from '../../stores/UserStore';
import RightStore from '../../stores/RightStore';


function getLocalState() {
    let localState = {
        connectors: ConnectorStore.all,
        users: UserStore.all,
        rights: RightStore.all,
    };
    return RaccoonApp.getState(localState);
}

var SettingsApp = React.createClass({

    getInitialState: function() {
        return getLocalState();
    },

    componentDidMount: function() {
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
        ConnectorStore.addListener(this._onChange);
        RightStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
        ConnectorStore.addListener(this._onChange);
        RightStore.addListener(this._onChange);
    },

    _onChange: function() {
        let state = getLocalState();
        this.setState(state);
    },

    /**
     * @return {object}
     */
    render: function() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <Sidebar
                        projects={this.state.allProjects}
                        environments={this.state.allEnvironments}
                        actions={this.state.actions}
                        connectors={this.state.connectors}
                        users={this.state.users}
                        rights={this.state.rights}
                    />
                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
                        <Topbar />
                        <Taskbar />

                        <div className="content">
                            <br />

                        </div>
                    </div>
                </div>
            </div>
        );
    },

});

export default SettingsApp;
