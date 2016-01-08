import React from 'react';
import { Link } from 'react-router'

import Loader from '../components/Loader.react';


var Topbar = React.createClass({

    toggleTasks: function () {
        console.log('aaaaa');
        //$('.slidemenu').toggleClass('slidemenu-open');
    },

    render: function () {
        return (
            <nav className="navbar navbar-default">
                <Loader />
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <a className="navbar-brand" href="#">
                            <img src="/static/assets/img/raccoon.png" className="pull-left" style={{ opacity: .6, marginTop: -10 + 'px', width: 50 +'px' }} />
                            <span style={{ marginLeft: 10 + 'px' }}>Raccoon</span>
                        </a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <li><Link to="/">Dashboard</Link></li>
                            <li><Link to="/settings">Settings</Link></li>
                            <li><a href="#">Help</a></li>
                            <li><Link to="/logout">Log Out</Link></li>
                            <li><a href="javascript: void(0);" className="btn-tasks" onclick={this.toggleTasks}><i className="fa fa-tasks" /></a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});

export default Topbar;
