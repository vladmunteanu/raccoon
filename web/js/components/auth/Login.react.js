import React from 'react'
import { History } from 'react-router';

import RaccoonApp from '../RaccoonApp.react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import LoginStore from '../../stores/LoginStore';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


let Login = React.createClass({
    mixins: [ History ],

    getInitialState: function () {
        return {
            username: '',
            password: '',
        }
    },

    login: function (event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.LOGIN_USER,
            data: this.state,
        });
    },

    componentDidMount: function() {
        LoginStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        LoginStore.removeListener(this._onChange);
    },

    _onChange: function() {
        if (LoginStore.isLoggedIn()) {
            RaccoonApp.fetchAll(); // fetch all everything at login
            this.history.pushState(null, '/');
        }
    },

    _onUsernameChange: function (event) {
        this.state.username = event.target.value;
        this.setState(this.state);
    },

    _onPasswordChange: function (event) {
        this.state.password = event.target.value;
        this.setState(this.state);
    },

    render: function () {
        return (
            <div className="row">
                <div className="col-sm-offset-4 col-sm-offset-4 col-md-offset-4 col-md-offset-4">
                    <div className="container">
                        <h3>Sign In</h3>
                        <form onSubmit={this.login} className="form-horizontal col-sm-4">
                            <div className="form-group">
                                <label htmlFor="username" className="control-label">Username or Email</label>
                                <input type="text" value={this.state.username} className="form-control"
                                       onChange={this._onUsernameChange}
                                       id="username" placeholder="Username or Email"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="control-label">Password</label>
                                <input type="password" value={this.state.password} className="form-control"
                                       onChange={this._onPasswordChange}
                                       id="password" placeholder="Password"/>
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Sign In" className="btn btn-info pull-right"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

export default Login;
