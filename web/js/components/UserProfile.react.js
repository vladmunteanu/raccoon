import React from 'react';


var UserProfile = React.createClass({

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
    },

    componentWillUnmount: function () {

    },

    _onChange: function () {

    },

    render: function () {
        return (
            <li className="media">
                <div className="media-left">
                    <a href="#">
                        <img className="media-object img-circle" src="/static/assets/img/user.jpg" alt="Alexandru Mihai" />
                    </a>
                </div>
                <div className="media-body">
                    <h4 className="media-heading">Alexandru Mihai</h4>
                    Software Developer
                </div>
            </li>
        );
    }
});

export default UserProfile;