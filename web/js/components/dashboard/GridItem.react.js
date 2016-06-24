import React from 'react'
import TimeAgo from 'react-timeago'

import RaccoonApp from '../RaccoonApp.react';
import CardMenu from './CardMenu.react';
import Utils from '../../utils/Utils';

import ActionStore from '../../stores/ActionStore';
import ProjectStore from '../../stores/ProjectStore';
import BuildStore from '../../stores/BuildStore';
import InstallStore from '../../stores/InstallStore';


function getLocalState(project, env) {
    let localState = {
        builds: BuildStore.filter(project.id),
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
    
    render() {
        let installedBuild = null;
        if (this.state.installedBuild)
            installedBuild = this.state.installedBuild;

        let content = (<div className="content"><h4 className="text-center">No builds for this project!</h4></div>);
        if (this.state.builds.length)
            content = (<div className="content"><h4 className="text-center">No build is installed!</h4></div>);
        if (this.state.installedBuild)
            content = (
                <div className="content">
                    <div>
                        {installedBuild.version}
                        <small className="pull-right">
                            <TimeAgo
                                date={this.state.install.date_added * 1000}
                                minPeriod={60}
                                formatter={Utils.timeAgoFormatter}
                            />
                        </small>
                        <br />
                        {installedBuild.branch}
                    </div>
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
                </div>
                {content}
            </div>
        );
    }
}

export default GridItem;
