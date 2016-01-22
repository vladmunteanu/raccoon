import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, History } from 'react-router';

import RaccoonApp from '../RaccoonApp.react';

import Sidebar from './Sidebar.react';
import Topbar from './../Topbar.react';
import Taskbar from './../Taskbar.react';

import ActionStore from '../../stores/ActionStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import ConnectorStore from '../../stores/ConnectorStore';
import UserStore from '../../stores/UserStore';
import RightStore from '../../stores/RightStore';
import MethodStore from '../../stores/MethodStore';
import NotificationStore from '../../stores/NotificationStore';


function getLocalState() {
    let localState = {
        connectors: ConnectorStore.all,
        users: UserStore.all,
        rights: RightStore.all,
        methods: MethodStore.all,
    };
    return RaccoonApp.getState(localState);
}

var SettingsApp = React.createClass({

    getInitialState: function() {
        RaccoonApp.fetchAll();

        ConnectorStore.fetchAll();
        RightStore.fetchAll();
        UserStore.fetchAll();
        MethodStore.fetchAll();

        return getLocalState();
    },

    componentDidMount: function() {
        ActionStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
        ConnectorStore.addListener(this._onChange);
        RightStore.addListener(this._onChange);
        UserStore.addListener(this._onChange);
        MethodStore.addListener(this._onChange);
        NotificationStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActionStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
        ConnectorStore.removeListener(this._onChange);
        RightStore.removeListener(this._onChange);
        UserStore.removeListener(this._onChange);
        MethodStore.removeListener(this._onChange);
        NotificationStore.addListener(this._onChange);
    },

    _onChange: function() {
        let state = getLocalState();
        this.setState(state);
    },

    /**
     * @return {object}
     */
    render: function() {
        let error_message = '';

        if (!!this.state.notifications && this.state.notifications.length > 0) {
            let notification = this.state.notifications.pop();
            error_message = (
                <div className="alert alert-danger col-sm-4" role="alert">
                    {notification.message}
                </div>
            );
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <Sidebar
                        projects={this.state.projects}
                        environments={this.state.environments}
                        actions={this.state.actions}
                        connectors={this.state.connectors}
                        users={this.state.users}
                        rights={this.state.rights}
                        methods={this.state.methods}
                    />
                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
                        {error_message}
                        <Topbar />
                        <Taskbar />


                        <div className="content">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    },

});

export default SettingsApp;
