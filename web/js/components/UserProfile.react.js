import React from 'react';

import AuthStore from '../stores/AuthStore';

function getCurrentState() {
    return {
        user: AuthStore.me || {}
    };
}

class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = getCurrentState();
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        AuthStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        AuthStore.removeListener(this._onChange);
    }

    _onChange() {
        this.setState(getCurrentState());
    }

    render() {
        return (
            <li className="media">
                <div className="media-left">
                    <a href="#">
                        <img className="media-object img-circle" src={ this.state.user.avatarUrl } alt={ this.state.user.name } />
                    </a>
                </div>
                <div className="media-body">
                    <h4 className="media-heading">{ this.state.user.name }</h4>
                    Software Developer
                </div>
            </li>
        );
    }
}

export default UserProfile;