import React from 'react'
import { Link } from 'react-router';
import Joi from 'joi';
import strategy from 'joi-validation-strategy';
import validation from 'react-validation-mixin';
import NotificationSystem from 'react-notification-system';

import RaccoonApp from '../RaccoonApp.react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import AuthStore from '../../stores/AuthStore';
import NotificationStore from '../../stores/NotificationStore';


function getLocalState() {
    let localState = {
        name: '',
        email: '',
        password: '',
        error: null
    };

    return RaccoonApp.getState(localState);
}

class Register extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = getLocalState();
        this.validatorTypes = {
            name: Joi.string().min(3).max(50).required().label('Full name'),
            password: Joi.string().alphanum().min(8).max(30).required().label('Password'),
            email: Joi.string().email().required().label('Email')
        };
        this.getValidatorData = this.getValidatorData.bind(this);
        this.renderHelpText = this.renderHelpText.bind(this);
        this.register = this.register.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    getValidatorData() {
        return this.state;
    }

    renderHelpText(messages) {
        return (
            <div className="text-danger">
                {
                    messages.map(message => {
                        return <div>{message}</div>
                    })
                }
            </div>
        );
    }

    register(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                AuthStore.register(this.state);
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
            RaccoonApp.fetchAll(); // fetch all everything at login
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

                    <form onSubmit={this.register} className="form-horizontal">
                        <hr />
                        <div className="form-group">
                            <label htmlFor="fullname" className="control-label">FULL NAME</label>
                            <input type="text" className="form-control"
                                id="fullname" placeholder="John Doe"
                                value={this.state.name}
                                onChange={this.onFormChange.bind(this, 'name')}
                                onBlur={this.props.handleValidation('name')}/>
                            {this.renderHelpText(this.props.getValidationMessages('name'))}
                        </div>

                        <hr />
                        <div className="form-group">
                            <label htmlFor="email" className="control-label">EMAIL ADDRESS</label>
                            <input type="text" className="form-control"
                                id="email" placeholder="john.doe@example.com"
                                value={this.state.email}
                                onChange={this.onFormChange.bind(this, 'email')}
                                onBlur={this.props.handleValidation('email')}/>
                            {this.renderHelpText(this.props.getValidationMessages('email'))}
                        </div>

                        <hr />
                        <div className="form-group">
                            <label htmlFor="password" className="control-label">PASSWORD</label>
                            <input type="password" className="form-control"
                                id="password" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                                value={this.state.password}
                                onChange={this.onFormChange.bind(this, 'password')}
                                onBlur={this.props.handleValidation('password')}/>
                            {this.renderHelpText(this.props.getValidationMessages('password'))}
                        </div>
                        
                        <br />
                        <div className="form-group">
                            <Link to="/login">Already have an account?</Link>
                            <input type="submit" value="Register" className="btn btn-info pull-right"/>
                        </div>
                    </form>

                </div>
            </div>
        );
    }
}

Register.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default validation(strategy)(Register);
