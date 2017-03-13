import React from 'react';
import { Link } from 'react-router';

import ActionStore from '../../stores/ActionStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';

import UserProfile from './../UserProfile.react.js';
import MenuItem from './../MenuItem.react.js';
import Utils from '../../utils/Utils';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


class Sidebar extends React.Component {
    render() {
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
                                        Utils.sortItems(this.props.projects).map(project => {
                                            return <MenuItem
                                                key={'dashboard-' + project.id}
                                                item={project}
                                                itemType={"project"}
                                                store = {ProjectStore}
                                                action={ActionTypes.PROJECT_TOGGLE_VISIBLE}
                                                switch={true}
                                                actions={ActionStore.filter(project, null, "project")}
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
                                        Utils.sortItems(this.props.environments).map(env => {
                                            return <MenuItem
                                                key={'dashboard-' + env.id}
                                                item={env}
                                                itemType={"env"}
                                                store = {EnvironmentStore}
                                                action={ActionTypes.ENVIRONMENT_TOGGLE_VISIBLE}
                                                switch={true}
                                                actions={ActionStore.filter(null, env, "environment")}
                                            />;
                                        })
                                    }
                                    <li>
                                        <Link to="settings/environment/new">
                                            <i className="fa fa-plus" /> Add new
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;
