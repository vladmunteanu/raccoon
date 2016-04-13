import React from 'react';
import { Link } from 'react-router';
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
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseProjects" aria-expanded="false" aria-controls="collapseProjects">
                                Projects <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseProjects" className="collapse in">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.projects.map(project => {
                                            return <MenuItem key={project.id} item={project} link={"/settings/project/" + project.id} />;
                                        })
                                    }
                                    <li>
                                        <Link to="/settings/project/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseEnvironments" aria-expanded="false" aria-controls="collapseEnvironments">
                                Environments <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseEnvironments" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.environments.map(environment => {
                                            return <MenuItem key={environment.id} item={environment} link={"/settings/environment/" + environment.id} />;
                                        })
                                    }
                                    <li>
                                        <Link to="/settings/environment/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseMethods" aria-expanded="false" aria-controls="collapseMethods">
                                Methods <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseMethods" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.methods.map(method => {
                                            return <MenuItem key={method.id} item={method} link={"/settings/method/" + method.id} />;
                                        })
                                    }
                                    <li>
                                        <Link to="/settings/method/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseFlows" aria-expanded="false" aria-controls="collapseFlows">
                                Flows <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseFlows" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.flows.map(flow => {
                                            return <MenuItem key={flow.id} item={flow} link={"/settings/flow/" + flow.id} />;
                                        })
                                    }
                                    <li>
                                        <Link to="/settings/flow/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseActions" aria-expanded="false" aria-controls="collapseActions">
                                Actions <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseActions" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.actions.map(action => {
                                            return <MenuItem key={action.id} item={action} link={"/settings/action/" + action.id} />;
                                        })
                                    }
                                    <li>
                                        <Link to="/settings/action/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseConnectors" aria-expanded="false" aria-controls="collapseConnectors">
                                Connectors <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseConnectors" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.connectors.map(connector => {
                                            return <MenuItem key={connector.id} item={connector} link={"/settings/connector/" + connector.id} />;
                                        })
                                    }
                                    <li>
                                        <Link to="/settings/connector/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseUsers" aria-expanded="false" aria-controls="collapseUsers">
                                Users <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseUsers" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.users.map(user => {
                                            return <MenuItem key={user.id} item={user} />;
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
                            <a href="javascript: void(0);" data-toggle="collapse" data-target="#collapseRights" aria-expanded="false" aria-controls="collapseRights">
                                Rights <i className="fa fa-angle-down pull-right" />
                            </a>
                            <div id="collapseRights" className="collapse">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.rights.map(right => {
                                            return <MenuItem key={right.id} item={right} />;
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
