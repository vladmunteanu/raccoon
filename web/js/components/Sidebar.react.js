import React from 'react';
import ProjectStore from '../stores/ProjectStore';
import EnvironmentStore from '../stores/EnvironmentStore';

import UserProfile from './UserProfile.react';
import MenuItem from './MenuItem.react';


var Sidebar = React.createClass({
    render: function () {
        return (
            <div className="col-sm-3 col-md-2 sidebar">
                <ul className="nav nav-sidebar">
                    <UserProfile />
                    <li className="active">
                        <a href="#" data-toggle="collapse" data-target="#collapseProjects" aria-expanded="false" aria-controls="collapseProjects">
                            Projects <i className="fa fa-angle-down pull-right" />
                        </a>
                        <div id="collapseProjects" className="collapse in">
                            <ul className="nav nav-submenu">
                                {
                                    this.props.allProjects.map(project => {
                                        return <MenuItem store={ProjectStore} item={project} />;
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
                                        return <MenuItem store={EnvironmentStore} item={env} />;
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
