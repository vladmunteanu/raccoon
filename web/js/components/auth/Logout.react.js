import React from 'react';
import { History } from 'react-router';

let Logout = React.createClass({
    mixins: [ History ],

    componentDidMount() {
        delete localStorage.token
        this.history.pushState(null, '/login');
    },

    render: function () {
        return (
            <p>You are now logged out</p>
        );
    }
});

export default Logout;