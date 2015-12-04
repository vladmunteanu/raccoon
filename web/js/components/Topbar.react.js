import React from 'react';
import ProjectStore from '../stores/ProjectStore';
//import EnvironmentStore from '../stores/EnvironmentStore';


var Topbar = React.createClass({

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
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">
                            <img src="/static/assets/img/raccoon.png" className="pull-left" style={{ opacity: .6, marginTop: -10 + 'px', width: 50 +'px' }} />
                            <span style={{ marginLeft: 10 + 'px' }}>Raccoon</span>
                        </a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="#">Dashboard</a></li>
                            <li><a href="#">Settings</a></li>
                            <li><a href="#">Help</a></li>
                            <li><a href="#" className="btn-tasks"><i className="fa fa-tasks"></i></a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});

export default Topbar;
