import React from 'react';
import { Link } from 'react-router'

import AuthStore from '../stores/AuthStore';
import RaccoonApp from './RaccoonApp.react';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Loader from '../components/Loader.react';
import Constants from '../constants/Constants';
let ActionTypes = Constants.ActionTypes;

class Topbar extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = RaccoonApp.getState();
        this._onChange = this._onChange.bind(this);
        this.toggleTasks = this.toggleTasks.bind(this);
    }

    componentDidMount() {
        AuthStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        AuthStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = RaccoonApp.getState();
        this.setState(state);
    }

    toggleTasks() {
        AppDispatcher.dispatch({
            action: ActionTypes.TASKBAR_TOGGLE
        })
    }

    render() {
        let settingsButton;
        if (this.state.user && this.state.user.role == 'admin') {
            settingsButton = <li><Link to="/settings">Settings</Link></li>;
        }

        return (
            <nav className="navbar navbar-default" style={{"margin": "0px -15px"}}>
                <Loader />
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <Link to="/" className="navbar-brand">
                            <img src="/static/assets/img/raccoon.png" className="pull-left" style={{ opacity: .6, marginTop: -10 + 'px', width: 50 +'px' }} />
                            <span style={{ marginLeft: 10 + 'px' }}>Raccoon</span>
                        </Link>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <li><Link to="/">Dashboard</Link></li>
                            { settingsButton }
                            <li><a href="javascript: void(0);">Help</a></li>
                            <li><Link to="/logout">Log Out</Link></li>
                            <li><a href="javascript: void(0);" className="btn-tasks" onClick={this.toggleTasks}><i className="fa fa-tasks" /></a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Topbar;
