import React from 'react';

class Logout extends React.Component {
    componentDidMount() {
        delete localStorage.token;
        this.context.router.push('/login');
    }

    render() {
        return (
            <p>You are now logged out</p>
        );
    }
}

Logout.contextTypes = {
    router: React.PropTypes.object.isRequired
};


export default Logout;
