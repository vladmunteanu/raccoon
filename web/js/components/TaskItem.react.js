import React from 'react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router';

// stores
import ProjectStore from '../stores/ProjectStore';
import EnvironmentStore from '../stores/EnvironmentStore';
import JobStore from '../stores/JobStore';

import RaccoonApp from './RaccoonApp.react';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Utils from '../utils/Utils';
import TaskProgressBar from './TaskProgressBar.react';
import {TASK_READY_STATES, TASK_UNREADY_STATES} from '../constants/Constants';


function getLocalState(projectId, envId, jobId) {
    let localState = {
        local: {
            project: ProjectStore.getById(projectId),
            environment: null
        }
    };

    if (envId) {
        let env = EnvironmentStore.getById(envId);
        localState['local']['environment'] = env.name;
    }

    if (jobId) {
        localState['local']['job'] = JobStore.getById(jobId);
    }

    return RaccoonApp.getState(localState)
}

export class TaskItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = getLocalState(
            this.props.data.context.project.id,
            this.props.data.environment,
            this.props.data.job
        );

        this._onChange = this._onChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    _onChange() {
        let state = getLocalState(
            this.props.data.context.project.id,
            this.props.data.environment,
            this.props.data.job
        );
        this.setState(state);
    }

    componentDidMount() {
        JobStore.addListener(this._onChange);

        JobStore.fetchById(this.props.data.job);
    }

    componentWillUnmount() {
        JobStore.removeListener(this._onChange);
    }

    handleCancel() {
        let build_number = this.props.data.result ? this.props.data.result.number : null;
        if (build_number) {
            AppDispatcher.dispatch({
                action: this.props.data.connector_type,
                data: {
                    method: 'stop',
                    args: {
                        task_id: this.props.data.id,
                        job_id: this.props.data.job,
                        build_number: build_number
                    }
                }
            });
        }
    }

    render() {
        if (!this.state.local.project || !this.state.user) {
            // loading
            return <div></div>;
        }

        let data = this.props.data;
        let now = new Date().getTime();

        // progress bar
        let progressBar = null;
        if (TASK_UNREADY_STATES.has(data.status)) {
            progressBar = <TaskProgressBar task={data}/>;
        }

        // cancel button
        let cancelButton;
        let build_number = data.result ? data.result.number : null;
        if (
            build_number &&
            data.status !== 'PENDING' &&
            data.user === this.state.user.id &&
            TASK_UNREADY_STATES.has(data.status)
        ) {
            cancelButton = (
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCancel}>
                    <span aria-hidden="true">Cancel</span>
                </button>
            );
        }

        // add gray style to old tasks
        let taskClass = '';
        if (now - data.date_added * 1000 > 3600000 * 3) {
            taskClass = 'old';
        }

        let task_date = new Date();

        let title = this.state.local.project.label || this.state.local.project.name;
        if (this.state.local.environment) {
            title += " > " + this.state.local.environment;
        }

        let jobType = null;
        if (this.state.local.job) {
            let clsName = 'default';
            if (data.status === 'SUCCESS') {
                clsName = 'success';
            }
            else if (data.status === 'STARTED' || data.status === 'PENDING') {
                clsName = 'warning';
            }
            else {
                clsName = 'danger'
            }
            jobType = (
                <span className={"label label-" + clsName} style={styles.jobTypeLabel}>
                    { this.state.local.job.action_type.toUpperCase() }
                </span>
            )
        }

        let taskTitle = (
            <div>
                { title }
                { jobType }
            </div>
        );

        let branchElement = null;
        if (data.context.branch) {
            branchElement = (
                <div>
                    {"branch: " + data.context.branch}<br/>
                </div>
            )
        }

        let version = null;
        if (data.context.version) {
            version = data.context.version;
        }
        else if (data.context.build) {
            version = data.context.build.version;
        }
        let versionElement = null;
        if (version) {
            versionElement = (
                <div>
                    {"version: " + version}<br/>
                </div>
            )
        }

        return (
            <Link to={this.props.link} className="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                <div className={`list-group-item ${taskClass}`}>
                    <div className="list-group-item-heading">
                        <span className="title">
                            {taskTitle}
                        </span>
                        { cancelButton }
                    </div>
                    <div className="list-group-item-text">
                        { branchElement }
                        { versionElement }
                        { data.status }
                        <span className="time pull-right">
                            <TimeAgo
                                date={new Date(data.date_added * 1000)}
                                minPeriod={60}
                                formatter={Utils.timeAgoFormatter}
                            />
                        </span>
                    </div>
                    { progressBar }
                </div>
            </Link>
        );
    }
}


const styles = {
    jobTypeLabel: {
        marginLeft: '15px',
        fontSize: '9px',
    }
};
