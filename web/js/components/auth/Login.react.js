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


function getLocalState() {
    let localState = {
        email: '',
        password: '',
        error: null
    };

    return RaccoonApp.getState(localState);
}

let Login = React.createClass({
    mixins: [ History ],

    getInitialState: function () {
        return getLocalState();
    },

    validatorTypes: {
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().min(8).max(30).required().label('Password')
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

    login: function (event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                AuthStore.authenticate(this.state);
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

        if (AuthStore.isLoggedIn()) {
            RaccoonApp.fetchAll(); // fetch everything at login
            this.history.pushState(null, '/');
        }
    },

    onFormChange: function(name, event) {
        this.state[name] = event.target.value;
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
                <div className="col-sm-offset-4">
                    <div className="container">
                        {error_message}
                    </div>
                    <div className="container">

                        <h3>Sign In</h3>
                        <form onSubmit={this.login} className="form-horizontal col-sm-4">
                            <div className="form-group">
                                <label htmlFor="username" className="control-label">Email</label>
                                <input type="text" ref="username" id="username"
                                    className="form-control" placeholder="Username"
                                    value={this.state.email}
                                    onChange={this.onFormChange.bind(this, 'email')}
                                    onBlur={this.props.handleValidation('email')}/>
                                {this.renderHelpText(this.props.getValidationMessages('email'))}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="control-label">Password</label>
                                <input type="password" ref="password" id="password"
                                    className="form-control" placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.onFormChange.bind(this, 'password')}
                                    onBlur={this.props.handleValidation('password')}/>
                                {this.renderHelpText(this.props.getValidationMessages('password'))}
                            </div>
                            <div className="form-group">
                                <a href="/#/register">Not registered yet?</a>
                                <input type="submit" value="Sign In" className="btn btn-info pull-right"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );

    }
});

export default validation(strategy)(Login);
