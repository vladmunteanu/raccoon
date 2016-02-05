import React from 'react'
import { History } from 'react-router';
import Joi from 'joi';
import strategy from 'joi-validation-strategy';
import validation from 'react-validation-mixin';

import RaccoonApp from '../RaccoonApp.react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import AuthStore from '../../stores/AuthStore';
import NotificationStore from '../../stores/NotificationStore';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;

function getLocalState() {
    let localState = {
        name: '',
        username: '',
        email: '',
        password: '',
        error: null
    };

    return RaccoonApp.getState(localState);
}

let Register = React.createClass({
    mixins: [ History ],

    getInitialState: function () {
        return getLocalState();
    },

    validatorTypes: {
        name: Joi.string().min(3).max(50).required().label('Full name'),
        username: Joi.string().alphanum().min(3).max(50).required().label('Username'),
        password: Joi.string().alphanum().min(8).max(30).required().label('Password'),
        email: Joi.string().email().required().label('Email')
    },

    getValidatorData: function () {
        return this.state;
    },

    renderHelpText: function (messages) {
        return (
            <div className="text-danger">
                {
                    messages.map(message => {
                        return <div>{message}</div>
                    })
                }
            </div>
        );
    },

    register: function (event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                AppDispatcher.dispatch({
                    action: ActionTypes.REGISTER_USER,
                    data: this.state
                });
            }
        });

    },

    componentDidMount: function() {
        AuthStore.addListener(this._onChange);
        NotificationStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        AuthStore.removeListener(this._onChange);
        NotificationStore.removeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getLocalState());

 /*       if (AuthStore.error) {
            this.state.error = AuthStore.error;
            AuthStore.error = null;
            this.setState(this.state);
        }*/

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

        if (!!this.state.notifications && this.state.notifications.length > 0) {
            let notification = this.state.notifications.pop();
            error_message = (
                <div className="alert alert-danger col-sm-4" role="alert">
                    {notification.message}
                </div>
            );
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
                                <input type="text" className="form-control"
                                    id="fullname" placeholder="Full name"
                                    value={this.state.name}
                                    onChange={this._onNameChange}
                                    onBlur={this.props.handleValidation('name')}/>
                                {this.renderHelpText(this.props.getValidationMessages('name'))}
                            </div>
                            <div className="form-group">
                                <label htmlFor="username" className="control-label">Username</label>
                                <input type="text" className="form-control"
                                    id="username" placeholder="Username"
                                    value={this.state.username}
                                    onChange={this._onUsernameChange}
                                    onBlur={this.props.handleValidation('username')}/>
                                {this.renderHelpText(this.props.getValidationMessages('username'))}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="control-label">Email</label>
                                <input type="text" className="form-control"
                                    id="email" placeholder="Email"
                                    value={this.state.email}
                                    onChange={this._onEmailChange}
                                    onBlur={this.props.handleValidation('email')}/>
                                {this.renderHelpText(this.props.getValidationMessages('email'))}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="control-label">Password</label>
                                <input type="password" className="form-control"
                                    id="password" placeholder="Password"
                                    value={this.state.password}
                                    onChange={this._onPasswordChange}
                                    onBlur={this.props.handleValidation('password')}/>
                                {this.renderHelpText(this.props.getValidationMessages('password'))}
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

export default validation(strategy)(Register);
