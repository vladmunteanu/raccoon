import React from 'react'
import TimeAgo from 'react-timeago'

import CardMenu from './CardMenu.react';
import Utils from '../../utils/Utils';
import TaskProgressBar from '../TaskProgressBar.react';

import ActionStore from '../../stores/ActionStore';
import BuildStore from '../../stores/BuildStore';
import InstallStore from '../../stores/InstallStore';
import TaskStore from '../../stores/TaskStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import {TASK_UNREADY_STATES} from "../../constants/Constants";

class GridItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            install: null,
            installedBuild: null,
            noInstalledBuild: false,
            tasksInProgress: null
        };

        this._onInstallChange = this._onInstallChange.bind(this);
        this._onBuildChange = this._onBuildChange.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    componentWillMount() {
        InstallStore.addListener(this._onInstallChange);
        BuildStore.addListener(this._onBuildChange);
        TaskStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);

        InstallStore.fetchInstalls(this.props.project, this.props.environment)
    }

    componentWillUnmount() {
        InstallStore.removeListener(this._onInstallChange);
        BuildStore.removeListener(this._onBuildChange);
        TaskStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    }

    _onInstallChange() {
        let install = InstallStore.getLatestInstall(
            this.props.project, this.props.environment
        );
        if (
            (install && !this.state.install) ||
            (install && this.state.install && install.id !== this.state.install.id)
        ) {
            this.setState({
                install: install,
                installedBuild: null,
                noInstalledBuild: false
            }, () => {
                BuildStore.fetchById(install.build);
            });
        }
        else {
            this.setState({
                noInstalledBuild: true
            })
        }
    }

    _onBuildChange() {
        if (this.state.install) {
            let build = BuildStore.getById(this.state.install.build);
            if (build) {
                this.setState({
                    installedBuild: build
                });
            }
        }
    }

    /**
     * Reacts to TaskStore, ProjectStore or EnvironmentStore changes
     * to compute the list of in progress tasks.
     * @private
     */
    _onChange() {
        let tasks = TaskStore.all.filter(task => {
            let project = ProjectStore.getById(task.project);
            let environment = EnvironmentStore.getById(task.environment);

            if (!project || !environment) return false;

            return (
                project.id === this.props.project.id &&
                environment.id === this.props.environment.id &&
                (task.status === 'STARTED' || task.status === 'PENDING') &&
                task.connector_type === 'jenkins' &&
                task.action_type === 'install'
            );
        });

        // sort descending by date_added
        tasks.sort((a, b) => {return b.date_added - a.date_added});
        this.setState({tasksInProgress: tasks});
    }

    render() {
        let installedBuild = null;
        if (this.state.installedBuild) {
            installedBuild = this.state.installedBuild;
        }

        let content = (<h5 className="text-center">Loading...</h5>);
        if (this.state.noInstalledBuild) {
            content = (<h5 className="text-center">No build installed yet</h5>);
        }

        // progress bar for a running install task
        let progressBar = null;
        if (this.state.tasksInProgress && this.state.tasksInProgress.length > 0) {
            progressBar = (
                <div>
                    <TaskProgressBar task={this.state.tasksInProgress[0]}/>
                    <div style={{textAlign: 'center'}}>
                        install in progress...
                    </div>
                </div>
            )
        }

        if (installedBuild) {
            content = (
                <div className="dropdown">
                    {installedBuild.version}
                    <small className="pull-right">
                        <TimeAgo
                            date={this.state.install.date_added * 1000}
                            minPeriod={60}
                            formatter={Utils.timeAgoFormatter}
                        />
                    </small>
                    <br />
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {installedBuild.branch}
                    </a>
                    <br/>
                    <div>{progressBar}</div>
                    <ul className="dropdown-menu">
                        <li className="dropdown-header">Changelog</li>
                        {
                            installedBuild.changelog.slice(0, 10).map((commit, i) => {
                                let msg = commit.message.split('\n');
                                let commitTitle = commit.message;
                                if (msg && msg.length > 0) {
                                    commitTitle = msg[0]
                                }
                                return (
                                    <li className="dropdown-item" key={"commit-" + i} style={styles.changelogCommit}>
                                        <span>
                                            <b>{commit.author.name}</b>
                                            {" - "}
                                            <small>
                                                <TimeAgo
                                                    date={(new Date(commit.date)).getTime()}
                                                    minPeriod={60}
                                                    formatter={Utils.timeAgoFormatter}
                                                />
                                            </small>
                                            {" - "}
                                            <a href={commit.url} target="_blank">{commitTitle}</a>
                                        </span>
                                        <div className="divider" style={styles.changelogCommitDivider}/>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            );
        }

        let cardActions = ActionStore.filter(this.props.project, this.props.environment, "card");
        return (
            <div className="box pull-left">
                <div className="header">
                    <div className="row">
                        <span className="version pull-left">{this.props.environment.name.toUpperCase()}</span>
                        <span className="version pull-left">&nbsp;&nbsp;{this.props.project.label}</span>
                        <CardMenu project={this.props.project.id}
                                  environment={this.props.environment.id}
                                  actions={cardActions} />
                    </div>
                </div>
                <div className="content">
                    {content}
                </div>
            </div>
        );
    }
}

const styles = {
    changelogCommit: {
        marginLeft: '3px',
        marginRight: '3px',
    },
    changelogCommitDivider: {
        margin: '3px 0'
    }
};

export default GridItem;
