import React from 'react';
import { Router, Route } from 'react-router';

import NotFound from './NotFound.react';
import DashboardApp from './dashboard/DashboardApp.react.js';
import Login from './auth/Login.react.js';


let RaccoonApp = React.createClass({

    getInitialState: function () {
        console.log('Raccoon app, initial state');
        return {};
    },

    /**
    * @return {object}
    */
    render: function () {
        return (
            <Router>
                <Route path="/" component={DashboardApp} />
                <Route path="/login" component={Login} />
                <Route path="*" component={NotFound} />
            </Router>
        );
    },

});

export default RaccoonApp;
