import React from 'react';
import { Router, Route } from 'react-router';

import ActionStore from '../stores/ActionStore';
import AuthStore from '../stores/AuthStore';
import EnvironmentStore from '../stores/EnvironmentStore';
import ProjectStore from '../stores/ProjectStore';

import DashboardApp from './dashboard/DashboardApp.react';
import Login from './auth/Login.react';
import Logout from './auth/Logout.react';
import NotFound from './NotFound.react';
import SettingsApp from './settings/SettingsApp.react';
import Register from './auth/Register.react';

import EnvironmentForm from './settings/EnvironmentForm.react.js';
import EnvironmentUpdateForm from './settings/EnvironmentUpdateForm.react';
import ProjectForm from './settings/ProjectForm.react';
import ProjectUpdateForm from './settings/ProjectUpdateForm.react';
import ActionForm from './settings/ActionForm.react';
import ActionUpdateForm from './settings/ActionUpdateForm.react';


function getRaccoonState() {
    return {
        projects: ProjectStore.all,
        environments: EnvironmentStore.all,
        actions: ActionStore.all,
        user: AuthStore.me,
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
     * @param replaceState
     * @param callback
     */
    requireAuth: function (nextState, replaceState, callback) {
        if (!AuthStore.isLoggedIn()) {
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
                <Route path="/settings" component={SettingsApp} onEnter={this.requireAuth}>
                    <Route path="project/new" component={ProjectForm} onEnter={this.requireAuth} />
                    <Route path="project/:id" component={ProjectUpdateForm} onEnter={this.requireAuth} />
                    <Route path="environment/new" component={EnvironmentForm} onEnter={this.requireAuth} />
                    <Route path="environment/:id" component={EnvironmentUpdateForm} onEnter={this.requireAuth} />
                    <Route path="action/new" component={ActionForm} onEnter={this.requireAuth} />
                    <Route path="action/:id" component={ActionUpdateForm} onEnter={this.requireAuth} />
                </Route>
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
                <Route path="/register" component={Register} />
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
    AuthStore.fetchMe();
    ProjectStore.fetchAll();
    EnvironmentStore.fetchAll();
    ActionStore.fetchAll();
};



export default RaccoonApp;
