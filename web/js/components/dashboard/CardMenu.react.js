import React from 'react';
import ActionStore from '../../stores/ActionStore';

import UserProfile from './../UserProfile.react.js';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


var CardMenu = React.createClass({
    render: function () {
        return (
            <div className="btn-group btn-settings pull-right">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="fa fa-edit" />
                </a>
                <ul className="dropdown-menu">
                    <li><a href="#">Edit</a></li>
                    <li><a href="#">Install</a></li>
                    <li role="separator" className="divider" />
                    <li><a href="#">Delete</a></li>
                </ul>
            </div>
        );
    }
});