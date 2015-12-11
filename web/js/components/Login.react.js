import React from 'react'
import { History } from 'react-router';

import AppDispatcher from '../dispatcher/AppDispatcher';
import LoginStore from '../stores/LoginStore';

import Constants from '../constants/Constants';
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
            <form>
                <input type="text" value={this.state.username} onChange={this._onUsernameChange} placeholder="Username" />
                <input type="password" value={this.state.password} onChange={this._onPasswordChange} placeholder="Password" />
                <button type="submit" onClick={this.login}>Submit</button>
            </form>
        );
    }
});

export default Login;
