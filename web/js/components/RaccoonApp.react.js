import React from 'react';
import { Router, Route } from 'react-router';

import LoginStore from '../stores/LoginStore';
import ProjectStore from '../stores/ProjectStore';
import EnvironmentStore from '../stores/EnvironmentStore';

import NotFound from './NotFound.react';
import DashboardApp from './dashboard/DashboardApp.react';
import Login from './auth/Login.react';
import SettingsApp from './settings/SettingsApp.react';


function getRaccoonState() {
    return {
        allProjects: ProjectStore.getAll(),
        allEnvironments: EnvironmentStore.getAll(),
        user: LoginStore.me,
    };
}

let RaccoonApp = React.createClass({

    getInitialState: function () {
        console.log('Raccoon app, initial state');

        RaccoonApp.fetchAll();

        return {};
    },

    /**
     * Middleware that checks if user is authenticated; if not redirect to /login
     * @param nextState
     * @param transition
     * @param callback
     */
    requireAuth: function (nextState, replaceState, callback) {
        if (!LoginStore.isLoggedIn()) {
            console.log(transition);
            replaceState({nextPathname: nextState.location.pathname}, '/login');
        }

        callback();
    },

    /**
    * @return {object}
    */
    render: function () {
        return (
            <Router>
                <Route path="/" component={DashboardApp} onEnter={this.requireAuth} />
                <Route path="/settings" component={SettingsApp} onEnter={this.requireAuth} />
                <Route path="/login" component={Login} />
                <Route path="*" component={NotFound} />
            </Router>
        );
    },

});


/**
 * Updates the state passed with the global state
 * @param state [Object]
 * @returns {*|{}}
 */
RaccoonApp.getState = function (state) {
    var globalState = getRaccoonState();
    state = state || {};

    for (var key in state) {
        if (state.hasOwnProperty(key)) {
            globalState[key] = state[key];
        }
    }

    return globalState;
};

/**
 * Fetches the global data
 */
RaccoonApp.fetchAll = function () {
    LoginStore.fetchMe();
    ProjectStore.fetchAll();
    EnvironmentStore.fetchAll();
};



export default RaccoonApp;
