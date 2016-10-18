import React from 'react';
import { Link } from 'react-router';
import Joi from 'joi';
import strategy from 'joi-validation-strategy';
import validation from 'react-validation-mixin';
import NotificationSystem from 'react-notification-system';

import RaccoonApp from '../RaccoonApp.react';
import FormValidationError from '../FormValidationError.react';

// stores
import AuthStore from '../../stores/AuthStore';
import NotificationStore from '../../stores/NotificationStore';


function getLocalState() {
    let localState = {
        email: '',
        password: '',
        error: null
    };

    return RaccoonApp.getState(localState);
}


class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = getLocalState();
        this.validatorTypes = {
            email: Joi.string().email().required().label('Email'),
            password: Joi.string().required().label('Password')
        };
        this.getValidatorData = this.getValidatorData.bind(this);
        this.login = this.login.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    getValidatorData() {
        return this.state;
    }

    login(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                AuthStore.authenticate(this.state);
            }
        });
    }

    componentDidMount() {
        AuthStore.addListener(this._onChange);
        NotificationStore.addListener(this._onChange);
        this._notificationSystem = this.refs.notificationSystem;
    }

    componentWillUnmount() {
        AuthStore.removeListener(this._onChange);
        NotificationStore.removeListener(this._onChange);
    }

    _onChange() {
        this.setState(getLocalState());

        if (AuthStore.isLoggedIn()) {
            RaccoonApp.fetchAll(); // fetch everything at login
            this.context.router.push('/');
        }

        NotificationStore.display(this._notificationSystem);
    }

    onFormChange(name, event) {
        this.state[name] = event.target.value;
        this.setState(this.state);
        this.props.validate(name);
    }

    render() {
        return (
            <div className="auth vertical-center gradient-background">
                <NotificationSystem ref="notificationSystem" />

                <div className="container">
                    <div className="logo text-center">
                        <img src="/static/assets/img/raccoon-white.png" />
                        <span>Raccoon</span>
                    </div>

                    <form onSubmit={this.login} className="form-horizontal">
                        <hr />
                        <div className="form-group">
                            <label htmlFor="username" className="control-label">EMAIL ADDRESS</label>
                            <input type="text" ref="username" id="username"
                                className="form-control" placeholder="john.doe@example.com"
                                value={this.state.email}
                                onChange={this.onFormChange.bind(this, 'email')}
                                onBlur={this.props.handleValidation('email')}/>
                            <FormValidationError key="form-errors-email" messages={this.props.getValidationMessages('email')}/>
                        </div>

                        <hr />
                        <div className="form-group">
                            <label htmlFor="password" className="control-label">PASSWORD</label>
                            <input type="password" ref="password" id="password"
                                className="form-control" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                                value={this.state.password}
                                onChange={this.onFormChange.bind(this, 'password')}
                                onBlur={this.props.handleValidation('password')}/>
                            <FormValidationError key="form-errors-password" messages={this.props.getValidationMessages('password')}/>
                        </div>

                        <br />
                        <div className="form-group">
                            <Link to="/register">Not registered yet?</Link>
                            <input type="submit" value="Sign In" className="btn btn-info pull-right"/>
                        </div>
                    </form>
                </div>
            </div>
        );

    }
}

Login.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default validation(strategy)(Login);
