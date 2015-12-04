import React from 'react';
import ProjectStore from '../stores/ProjectStore';
//import EnvironmentStore from '../stores/EnvironmentStore';

import MenuItem from '../utils/components/MenuItem.react';


var Sidebar = React.createClass({

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
            <div className="col-sm-3 col-md-2 sidebar">
                <ul className="nav nav-sidebar">
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
                    <li className="active">
                        <a href="#" data-toggle="collapse" data-target="#collapseProjects" aria-expanded="false" aria-controls="collapseProjects">
                            Projects <i className="fa fa-angle-down pull-right" />
                        </a>
                        <div id="collapseProjects" className="collapse in">
                            <ul className="nav nav-submenu">
                                {
                                    this.props.allProjects.map(project => {
                                        return <MenuItem title={project.name.charAt(0).toUpperCase() + project.name.slice(1)} id={project.name} />;
                                    })
                                }
                                <li>
                                    <a href="#">
                                        <i className="fa fa-plus" /> Add new
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <a href="#" data-toggle="collapse" data-target="#collapseEnvironments" aria-expanded="false" aria-controls="collapseEnvironments">
                            Environments <i className="fa fa-angle-down pull-right" />
                        </a>
                        <div id="collapseEnvironments" className="collapse in">
                            <ul className="nav nav-submenu">
                                {
                                    this.props.allEnvironments.map(env => {
                                        return <MenuItem title={env.name.charAt(0).toUpperCase() + env.name.slice(1)} id={env.name} />;
                                    })
                                }
                                <li>
                                    <a href="#">
                                        <i className="fa fa-plus" /> Add new
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
});

export default Sidebar;
