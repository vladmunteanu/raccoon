import React from 'react'
import { History } from 'react-router';

import RaccoonApp from '../RaccoonApp.react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import AuthStore from '../../stores/AuthStore';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


let Register = React.createClass({
    mixins: [ History ],

    getInitialState: function () {
        return {
            name: '',
            username: '',
            email: '',
            password: '',
            error: ''
        }
    },

    register: function (event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.REGISTER_USER,
            data: this.state
        });
    },

    componentDidMount: function() {
        AuthStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        AuthStore.removeListener(this._onChange);
    },

    _onChange: function() {
        if (AuthStore.error) {
            this.state.error = AuthStore.error;
            AuthStore.error = null;
            this.setState(this.state);
        }

        if (AuthStore.isLoggedIn()) {
            RaccoonApp.fetchAll(); // fetch all everything at login
            this.history.pushState(null, '/');
        }
    },

    _onNameChange: function (event) {
        this.state.name = event.target.value;
        this.setState(this.state);
    },

    _onEmailChange: function (event) {
        this.state.email = event.target.value;
        this.setState(this.state);
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
        let error_message = '';

        console.log(this.state);
        if (!!this.state.error) {
            error_message = (
                <div className="alert alert-danger col-sm-4" role="alert">
                    {this.state.error.message}
                </div>
            )
        }

        return (
            <div className="row">
                <div className="col-sm-offset-4 col-md-offset-4">
                    <div className="container">
                        {error_message}
                    </div>

                    <div className="container">
                        <h3>Register</h3>
                        <form onSubmit={this.register} className="form-horizontal col-sm-4">
                            <div className="form-group">
                                <label htmlFor="fullname" className="control-label">Full name</label>
                                <input type="text" value={this.state.name} className="form-control"
                                       onChange={this._onNameChange}
                                       id="fullname" placeholder="Full name"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="username" className="control-label">Username</label>
                                <input type="text" value={this.state.username} className="form-control"
                                       onChange={this._onUsernameChange}
                                       id="username" placeholder="Username"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="control-label">Email</label>
                                <input type="text" value={this.state.email} className="form-control"
                                       onChange={this._onEmailChange}
                                       id="email" placeholder="Email"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="control-label">Password</label>
                                <input type="password" value={this.state.password} className="form-control"
                                       onChange={this._onPasswordChange}
                                       id="password" placeholder="Password"/>
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Register" className="btn btn-info pull-right"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

export default Register;
