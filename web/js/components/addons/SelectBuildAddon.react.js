import React from 'react';
import TimeAgo from 'react-timeago'

// stores
import BaseAddon from './BaseAddon.react';
import BuildStore from '../../stores/BuildStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';

import Utils from '../../utils/Utils';


function getLocalState(project, env) {
    return {
        builds: BuildStore.filter(project.id),
        project: project,
        environment: env,
        selectedBuild: null
    }
}

class SelectBuildAddon extends BaseAddon {
    constructor(props) {
        super(props);
        this.state = getLocalState(
            this.addon_context.project,
            this.addon_context.environment
        );

        // add project_id and environment_id in the context
        // for the jenkins Interface
        this.updateContext('project_id', this.addon_context.project.id);
        this.updateContext('environment_id', this.addon_context.environment.id);

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        BuildStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);

        BuildStore.fetchBuilds(this.addon_context.project);
    }

    componentWillUnmount() {
        BuildStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState(
            this.addon_context.project,
            this.addon_context.environment
        );
        this.setState(state);
    }
    
    _onBuildSelect(buildId, event) {
        let build = BuildStore.getById(buildId);
        this.updateContext('build', build);
        this.updateContext('build_id', build.id);
        this.updateContext('branch', build.branch);

        this.setState({selectedBuild: build});
    }

    /** Checks that a build is selected. */
    validate(callback) {
        let error = this.state.selectedBuild ? null : {build: "must be specified!"};

        // call flow callback, enable notifications
        callback(error, true);
    }

    render() {
        let changelog = (<div>Select a build to view the changelog associated with it.</div>);
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
                                            <div className="col-sd-10 col-md-10 col-lg-10">
                                                <img src={Utils.gravatarUrl(commit.author.email)}
                                                     title={commit.author.name}
                                                     style={{width: 17, marginRight: 8}}
                                                     className="img-circle"
                                                     data-toggle="tooltip"
                                                     data-placement="bottom"
                                                     data-html="true"
                                                     data-original-title={commit.author.name}
                                                />
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
