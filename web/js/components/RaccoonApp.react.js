import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';

//var ProjectStore = require('../stores/ProjectStore');
//var EnvironmentStore = require('../stores/EnvironmentStore');

import DashboardApp from './DashboardApp.react';
import Login from './Login.react';



/*function getRaccoonState() {
    return {
        allProjects: ProjectStore.getAll(),
        //allEnvironments: EnvironmentStore.getAll(),
    };
}

*/
let raccoonApp = null;
class RaccoonApp extends React.Component {

    constructor() {
        if (!raccoonApp) {
            super();
            raccoonApp = this;
        } else {
            return raccoonApp;
        }

    }

    static getInitialState () {
        console.log('Raccoon app, initial state');
        return {};
        //return getRaccoonState();
    }

    // componentDidMount: function() {
    //     ProjectStore.addChangeListener(this._onChange);
    //     EnvironmentStore.addChangeListener(this._onChange);
    // },

    // componentWillUnmount: function() {
    //     ProjectStore.removeChangeListener(this._onChange);
    //     EnvironmentStore.removeChangeListener(this._onChange);
    // },

    /**
    * @return {object}
    */
    render () {
        return (
            <Router>
                <Route path="/login" component={Login} />
                <Route path="/" component={DashboardApp}>
                    //<Route path="settings" component={DashboardApp}/>
                    //<Route path="*" component={DashboardApp}/>
                </Route>
            </Router>
        );
    }

   /* _onChange: function() {
        this.setState(getRaccoonState());

    }
*/
}

export default RaccoonApp;
