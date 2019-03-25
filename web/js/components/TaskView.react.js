import React from 'react';
import TimeAgo from 'react-timeago';

import Utils from '../utils/Utils';
import UserStore from '../stores/UserStore';
import JobStore from '../stores/JobStore';
import TaskStore from '../stores/TaskStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {TASK_READY_STATES, TASK_UNREADY_STATES} from '../constants/Constants';


class TaskView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            taskId: props.params.id,
            task: null,
            user: null,
            job: null
        };

        this._onUserChange = this._onUserChange.bind(this);
        this._onJobChange = this._onJobChange.bind(this);
        this._onTaskChange = this._onTaskChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.params.id !== nextProps.params.id) {
            this.setState({
                taskId: nextProps.params.id,
                task: null,
                user: null,
                job: null,
            }, () => {
                TaskStore.fetchById(nextProps.params.id);
            });
        }
    }

    _onUserChange() {
        let user = UserStore.getById(this.state.task.user);
        if (user) {
            this.setState({user: user});
        }
    }

    _onJobChange() {
        let job = JobStore.getById(this.state.task.job);
        if (job) {
            this.setState({job: job});
        }
    }

    _onTaskChange() {
        let task = TaskStore.getById(this.props.params.id);
        if (task) {
            this.setState({
                task: task
            }, () => {
                UserStore.fetchById(task.user);
                JobStore.fetchById(task.job);
            });
        }
    }

    componentDidMount() {
        UserStore.addListener(this._onUserChange);
        JobStore.addListener(this._onJobChange);
        TaskStore.addListener(this._onTaskChange);

        TaskStore.fetchById(this.props.params.id);
    }

    componentWillUnmount() {
        UserStore.removeListener(this._onUserChange);
        JobStore.removeListener(this._onJobChange);
        TaskStore.removeListener(this._onTaskChange);
    }

    handleCancel() {
        let build_number = this.state.task.result ? this.state.task.result.number : null;
        if (build_number) {
            AppDispatcher.dispatch({
                action: this.state.task.connector_type,
                data: {
                    method: 'stop',
                    args: {
                        task_id: this.state.task.id,
                        job_id: this.state.task.job,
                        build_number: build_number
                    }
                }
            });
        }
    }

    render() {
        if (!this.state.task || !this.state.user || !this.state.job) {
            return (<div>Loading task information...</div>);
        }

        let console_output = (<div>No console output</div>);
        if (this.state.task.console_output) {
            console_output = this.state.task.console_output.split("\n").map((item, idx) => {
                /*
                    replace [URL]...[/URL] lines with links.
                    TODO: this isn't generic at all, we should probably replace urls directly.
                 */
                if (item.includes("[URL]")) {
                    item = item.replace(/\[\/?URL]/g, '');
                    item = (<a href={item}>{item}</a>);
                }
                return (
                    <span key={"console-line-" + idx} style={{"fontSize": "12px", "fontFamily": "Courier"}}>
                        {item}
                        <br/>
                    </span>
                );
            })
        }

        let task_date = new Date(this.state.task.date_added * 1000);
        let progressBar = null;

        /* Check Task status and create the progress bar */
        if (TASK_UNREADY_STATES.has(this.state.task.status)) {
            let now = new Date().getTime();
            let started_at = this.state.task.started_at || 0;
            let estimated_duration = this.state.task.estimated_duration || 0;
            let duration = now - started_at;
            let progress = this.state.task.status == 'SUCCESS' ? 100 : Math.round(duration * 100 / estimated_duration);
            progressBar = (
                <div className="materialize-progress">
                    <div
                        className={this.state.task.status == 'PENDING' ? 'indeterminate' : 'determinate'}
                        style={{width: progress + "%"}}
                    />
                </div>
            );
        }

        let pending_reason = null;

        if (this.state.task.status == 'PENDING') {
            pending_reason = (
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-lg-6">{"Pending reason: "}</div>
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        {this.state.task.why}
                    </div>
                </div>
            )
        }

        let cancelButton = null;
        if (this.state.task.status == 'STARTED') {
            cancelButton = (
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <button type="button" className="btn btn-sm btn-danger" aria-label="Close" onClick={this.handleCancel.bind(this)}>
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <div className="row">
                            <h3>{'Task '}
                                <small>
                                    <TimeAgo
                                        date={new Date(this.state.task.date_added * 1000)}
                                        minPeriod={60}
                                        formatter={Utils.timeAgoFormatter}
                                    />
                                </small>
                            </h3>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-sm-6 col-md-6 col-lg-6">{"Started by: "}</div>
                            <div className="col-sm-6 col-md-6 col-lg-6">{this.state.user.email}</div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-md-6 col-lg-6">{"Job: "}</div>
                            <div className="col-sm-6 col-md-6 col-lg-6">{this.state.job.job}</div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-md-6 col-lg-6">{"Created at: "}</div>
                            <div className="col-sm-6 col-md-6 col-lg-6">{task_date.toLocaleString()}</div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-md-6 col-lg-6">{"Status: "}</div>
                            <div className="col-sm-6 col-md-6 col-lg-6">
                                {this.state.task.status}
                                {progressBar}
                            </div>
                        </div>
                        {pending_reason}
                        {cancelButton}
                        <br/>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <h4>Console output</h4>
                    <div className="well well-sm">
                        {console_output}
                    </div>
                </div>
            </div>
        );
    }
}

export default TaskView;
