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
        installedBuild: null
    };

    if (localState.install) {
        let installedBuild = BuildStore.getById(localState.install.build);
        if (installedBuild)
            localState.installedBuild = installedBuild;
    }

    return RaccoonApp.getState(localState);
}

class GridItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = getLocalState(this.props.project, this.props.environment);
        this._onChange = this._onChange.bind(this);
    }

    componentWillMount() {
        ActionStore.addListener(this._onChange);
        BuildStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        InstallStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        ActionStore.removeListener(this._onChange);
        BuildStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        InstallStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState(this.props.project, this.props.environment);
        this.setState(state);
    }

    _onSelectBuild(id, event) {
        this.state.installedBuild = BuildStore.getById(id);
        this.setState(this.state);
    }

    render() {
        let buildsDropdown = (<div></div>);
        let installedBuild = null;
        if (this.state.builds.length)
            installedBuild = this.state.builds[0];
        if (this.state.installedBuild)
            installedBuild = this.state.installedBuild;

        if (installedBuild)
            buildsDropdown = (
                <div className="dropdown">
                    <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <h4 className="list-group-item-heading environment">
                            {installedBuild.version}-{this.props.project.build_nr}
                            <span className="caret" />
                        </h4>
                        <h5 className="branch">{installedBuild.branch}</h5>
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
            );

        let content = (<div className="content"><h4 className="text-center">No builds for this project!</h4></div>);
        if (this.state.builds.length)
            content = (<div className="content"><h4 className="text-center">No build is installed!</h4></div>);
        if (this.state.installedBuild)
            content = (
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
            );

        let footer = (<div></div>);
        if (this.state.builds.length)
            footer = (
                <div className="footer">
                    <button className="btn btn-xs btn-primary pull-right">Install</button>
                </div>
            );

        let cardActions = ActionStore.filter(this.props.project,this.props.environment,"card");
        return (
            <div className="box pull-left">
                <div className="header">
                    <div className="row">
                        <span className="version pull-left">{this.props.environment.name.toUpperCase()}</span>
                        <span className="version pull-left">&nbsp;&nbsp;{this.props.project.name}</span>
                        <CardMenu project={this.props.project.id}
                                  environment={this.props.environment.id}
                                  actions={cardActions} />
                    </div>
                    {buildsDropdown}
                </div>
                {content}
                {footer}
            </div>
        );
    }
}

export default GridItem;
