import React from 'react';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';

import UserProfile from './../UserProfile.react.js';
import MenuItem from './../MenuItem.react.js';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


var Sidebar = React.createClass({
    render: function () {
        return (
            <div className="col-sm-3 col-md-2 sidebar">
                <ul className="nav nav-sidebar" style={{height: 115 + 'px'}}>
                    <UserProfile />
                </ul>
                <div style={{ height: 100 + '%' }}>
                    <ul className="nav nav-sidebar" style={{ height: 100 + '%', overflow: 'auto' }}>
                        <li className="active">
                            <a href="" data-toggle="collapse" data-target="#collapseProjects" aria-expanded="false" aria-controls="collapseProjects">
                                Projects <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseProjects" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.projects.map(project => {
                                            return <MenuItem item={project} />;
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
                            <a href="" data-toggle="collapse" data-target="#collapseEnvironments" aria-expanded="false" aria-controls="collapseEnvironments">
                                Environments <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseEnvironments" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.environments.map(env => {
                                            return <MenuItem item={env} />;
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
                            <a href="" data-toggle="collapse" data-target="#collapseActions" aria-expanded="false" aria-controls="collapseActions">
                                Actions <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseActions" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.actions.map(action => {
                                            return <MenuItem item={action} />;
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
                            <a href="" data-toggle="collapse" data-target="#collapseConnectors" aria-expanded="false" aria-controls="collapseConnectors">
                                Connectors <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseConnectors" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.connectors.map(connector => {
                                            return <MenuItem item={connector} />;
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
                            <a href="" data-toggle="collapse" data-target="#collapseUsers" aria-expanded="false" aria-controls="collapseUsers">
                                Users <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseUsers" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.users.map(user => {
                                            return <MenuItem item={user} />;
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
                            <a href="" data-toggle="collapse" data-target="#collapseRights" aria-expanded="false" aria-controls="collapseRights">
                                Rights <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseRights" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.rights.map(user => {
                                            return <MenuItem item={user} />;
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
            </div>
        );
    }
});

export default Sidebar;
