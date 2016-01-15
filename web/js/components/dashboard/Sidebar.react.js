import React from 'react';
import { Link } from 'react-router';

import ActionStore from '../../stores/ActionStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';

import UserProfile from './../UserProfile.react.js';
import MenuItem from './../MenuItem.react.js';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;

import Util from '../../utils/Utils';


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
                                            return <MenuItem
                                                item={project}
                                                action={ActionTypes.PROJECT_TOGGLE_VISIBLE}
                                                switch={true}
                                                actions={ActionStore.filter(project)}
                                            />;
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
                            <div id="collapseEnvironments" className="collapse in">
                                <ul className="nav nav-submenu">
                                    {
                                        this.props.environments.map(env => {
                                            return <MenuItem
                                                item={env}
                                                action={ActionTypes.ENVIRONMENT_TOGGLE_VISIBLE}
                                                switch={true}
                                                actions={ActionStore.filter(null, env)}
                                            />;
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
