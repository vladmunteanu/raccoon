import React from 'react';
import TimeAgo from 'react-timeago'

// stores
import BaseAddon from './BaseAddon.react';
import BuildStore from '../../stores/BuildStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';

import Utils from '../../utils/Utils';


function getLocalState(projectId, envId) {
    return {
        builds: BuildStore.filter(projectId),
        project: ProjectStore.getById(projectId),
        environment: EnvironmentStore.getById(envId),
        selectedBuild: null
    }
}

class SelectBuildAddon extends BaseAddon {
    constructor(props) {
        super(props);
        this.state = getLocalState(this.props.context.project, this.props.context.environment);
        this._onChange = this._onChange.bind(this);

        if (this.state.environment) {
            this.updateContext('environment', this.state.environment.id);
        }
    }

    componentDidMount() {
        BuildStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        BuildStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState(this.props.context.project, this.props.context.environment);
        this.setState(state);

        if (this.state.environment) {
            this.updateContext('environment', this.state.environment.id);
        }
    }
    
    _onBuildSelect(buildId, event) {
        let build = BuildStore.getById(buildId);
        this.state.selectedBuild = build;
        this.updateContext('build', build.id);
        this.updateContext('branch', build.branch);
        this.updateContext('version', build.version);
        this.setState(this.state);
    }

    /** Checks that a build is selected. */
    validate(callback) {
        let error = this.state.selectedBuild ? null : {build: "must be specified!"};

        // call flow callback, enable notifications
        callback(error, true);
    }

    render() {
        let changelog = (<div>No build selected!!!</div>);
        if (this.state.selectedBuild) {
            changelog = (
                <div style={{height: 400, overflow: "auto"}}>
                    <ul className="media-list">
                        {
                            this.state.selectedBuild.changelog.map(commit => {
                                let commit_date = new Date(commit.date);
                                return (
                                    <li key={`commit-${commit.sha}`} className="container-fluid">
                                        <div className="row">
                                            <div className="col-sm-1 col-md-1 col-lg-1">
                                                <img src={Utils.gravatarUrl(commit.author.email)}
                                                     title={commit.author.name}
                                                     style={{width: 17}}
                                                     className="img-circle"
                                                     data-toggle="tooltip"
                                                     data-placement="bottom"
                                                     data-html="true"
                                                     data-original-title={commit.author.name}
                                                />
                                            </div>
                                            <div className="col-sd-9 col-md-9 col-lg-9">
                                                <span>
                                                    <b>{commit.author.name}</b>{" - " + commit.message}
                                                </span>
                                            </div>
                                            <div className="col-sd-2 col-md-2 col-lg-2">
                                                <small className="pull-right">
                                                    <TimeAgo
                                                        date={commit_date.getTime()}
                                                        minPeriod={60}
                                                        formatter={Utils.timeAgoFormatter}
                                                    />
                                                </small>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            );
        }

        return (
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <h3 className="text-center">Select a build</h3>
                    <div className="list-group" style={{height: 400, overflow: "auto"}}>
                    {
                        this.state.builds.sort((a, b) => {return b.date_added - a.date_added}).map(build => {
                            return (
                                <a
                                    key={`build-${build.version}`}
                                    href="javascript: void(0)"
                                    onClick={this._onBuildSelect.bind(this, build.id)}
                                    className="list-group-item">
                                    {build.version}
                                    <small className="pull-right">
                                        <TimeAgo
                                        date={build.date_added * 1000}
                                        minPeriod={60}
                                        formatter={Utils.timeAgoFormatter}
                                        />
                                    </small>
                                    <br />
                                    {build.branch}
                                </a>
                            );
                        })
                    }
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <h3 className="text-center">Check changelog</h3>
                    {changelog}
                </div>
            </div>
        );
    }
}

export default SelectBuildAddon;
