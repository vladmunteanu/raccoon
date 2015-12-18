import React from 'react';

import Utils from '../utils/Utils';
import AuthStore from '../stores/AuthStore';

let getCurrentState = function () {
    return {
        user: AuthStore.me || {},
    };
}

var UserProfile = React.createClass({

    getInitialState: function () {
        return getCurrentState();
    },

    componentDidMount: function () {
        AuthStore.addListener(this._onChange);
    },

    componentWillUnmount: function () {
        AuthStore.removeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(getCurrentState());
    },

    render: function () {
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
});

export default UserProfile;