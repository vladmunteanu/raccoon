import React from 'react'

import AppDispatcher from '../dispatcher/AppDispatcher';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            password: '',
        }
    }

    login(event) {
        event.preventDefault();
    }

    render() {
        return (
            <form role="form">
                <div className="form-group">
                    <input type="text" valueLink={this.linkState('user')}placeholder="Username" />
                    <input type="password" valueLink={this.linkState('password')} placeholder="Password" />
                </div>
                <button type="submit" onClick={this.login.bind(this)}>Submit</button>
            </form>
        );
    }
}

export default Login;

//reactMixin(Login.prototype, React.addons.LinkedStateMixin);
