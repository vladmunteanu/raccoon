import React from 'react';
import { Router, Route } from 'react-router';

import NotFound from './NotFound.react';
import DashboardApp from './DashboardApp.react';
import Login from './Login.react';


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
