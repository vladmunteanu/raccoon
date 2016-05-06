import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, History } from 'react-router';

import RaccoonApp from '../RaccoonApp.react';

import Sidebar from './Sidebar.react';
import Topbar from './../Topbar.react';
import Taskbar from './../Taskbar.react';
import Notification from '../Notification.react';

// stores
import ActionStore from '../../stores/ActionStore';
import FlowStore from '../../stores/FlowStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import ConnectorStore from '../../stores/ConnectorStore';
import UserStore from '../../stores/UserStore';
import RightStore from '../../stores/RightStore';
import JobStore from '../../stores/JobStore';
import NotificationStore from '../../stores/NotificationStore';


function getLocalState() {
    let localState = {
        connectors: ConnectorStore.all,
        users: UserStore.all,
        rights: RightStore.all,
        jobs: JobStore.all,
    };
    return RaccoonApp.getState(localState);
}

class SettingsApp extends React.Component {

    constructor(props, context) {
        super(props, context);
        RaccoonApp.fetchAll();
        ConnectorStore.fetchAll();
        RightStore.fetchAll();
        UserStore.fetchAll();
        JobStore.fetchAll();
        this.state = getLocalState();
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        ActionStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
        ConnectorStore.addListener(this._onChange);
        RightStore.addListener(this._onChange);
        UserStore.addListener(this._onChange);
        JobStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        ActionStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
        ConnectorStore.removeListener(this._onChange);
        RightStore.removeListener(this._onChange);
        UserStore.removeListener(this._onChange);
        JobStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState();
        this.setState(state);
    }

    render() {
        let error_message = '';

        return (
            <div className="container-fluid">
                <div className="row">
                    <Sidebar
                        projects={this.state.projects}
                        environments={this.state.environments}
                        actions={this.state.actions}
                        connectors={this.state.connectors}
                        flows={this.state.flows}
                        users={this.state.users}
                        rights={this.state.rights}
                        jobs={this.state.jobs}
                    />
                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
                        <Topbar />
                        <Taskbar />
                        <Notification />
                        <div className="content">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingsApp;
