import React from 'react'

import RaccoonApp from '../RaccoonApp.react';
import CardMenu from './CardMenu.react';
import Utils from '../../utils/Utils';

import ActionStore from '../../stores/ActionStore';
import ProjectStore from '../../stores/ProjectStore';
import BuildStore from '../../stores/BuildStore';
import InstallStore from '../../stores/InstallStore';


function getLocalState(project, env) {
    let localState = {
        builds: BuildStore.filter(project),
        install: InstallStore.getLatestInstall(project, env),
        installedBuild: {
            version: '',
            branch: '',
            changelog: []
        }
    };

    if (localState.install) {
        let installedBuild = BuildStore.getById(localState.install.build);
        if (installedBuild)
            localState.installedBuild = installedBuild;
    }

    return RaccoonApp.getState(localState);
}

let GridItem = React.createClass({
    getInitialState: function () {
        return getLocalState(this.props.project, this.props.environment);
    },

    componentWillMount: function() {
        ActionStore.addListener(this._onChange);
        BuildStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        InstallStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActionStore.removeListener(this._onChange);
        BuildStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        InstallStore.removeListener(this._onChange);
    },

    _onChange: function() {
        let state = getLocalState(this.props.project, this.props.environment);
        this.setState(state);
    },

    _onSelectBuild: function(id, event) {
        this.state.installedBuild = BuildStore.getById(id);
        this.setState(this.state);
    },

    render: function () {
        return (
            <div className="box pull-left">
                <div className="header">
                    <div className="row">
                        <span className="version pull-left">{this.props.environment.name.toUpperCase()}</span>
                        <CardMenu actions={ActionStore.filter(this.props.project,this.props.environment,"card")} />
                    </div>

                    <div className="dropdown">
                        <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <h4 className="list-group-item-heading environment">
                                {this.props.project.name} — {this.state.installedBuild.version}-{this.props.project.build_nr}
                                <span className="caret" />
                            </h4>
                            <h5 className="branch">{this.state.installedBuild.branch}</h5>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                            {
                                this.state.builds.map(build => {
                                    return (
                                        <li onClick={this._onSelectBuild.bind(this, build.id)}>
                                            <a href="#">
                                                <h4 className="list-group-item-heading environment">
                                                    {build.version}
                                                </h4>
                                                <h5 className="branch">{build.branch}</h5>
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="content">
                    <div>
                        <ul className="media-list">
                            {
                                this.state.installedBuild.changelog.map(commit => {
                                    return (
                                        <li className="media">
                                            <div className="media-left">
                                                <img src={Utils.gravatarUrl(commit.author.email)}
                                                     title={commit.author.name}
                                                     className="img-circle"
                                                     data-toggle="tooltip"
                                                     data-placement="bottom"
                                                     data-html="true"
                                                     data-original-title="Alexandru Mihai<br/>23-05-2015 2:00 PM"
                                                />
                                            </div>
                                            <div className="media-body">
                                                {commit.message}
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="footer">
                    <button className="btn btn-xs btn-primary pull-right">Install</button>
                </div>
            </div>
        );
    }
});

export default GridItem;
