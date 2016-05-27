import React from 'react'
import TimeAgo from 'react-timeago'

// stores
import ProjectStore from '../stores/ProjectStore';

import Utils from '../utils/Utils';


export const READY_STATES = new Set(['FAILURE', 'REVOKED', 'SUCCESS']);
export const UNREADY_STATES = new Set(['PENDING', 'RECEIVED', 'RETRY', 'STARTED']);

function getLocalState(projectId) {
    return {
        'project': ProjectStore.getById(projectId)
    }
}

export class TaskItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = getLocalState(this.props.data.context.project);
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        ProjectStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        ProjectStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState(this.props.data.context.project);
        this.setState(state);
    }

    render() {
        if (!this.state.project) {
            // loading
            return <div></div>;
        }
        
        let data = this.props.data;
        let now = new Date().getTime();
        let started_at = data.started_at || 0;
        let estimated_duration = data.estimated_duration || 0;

        let duration = now - started_at;
        let progress = Math.round(duration * 100 / estimated_duration);
        if (data.status == 'SUCCESS') {
            progress = 100;
        }

        let progressStyle = {
            width: progress + '%'
        };

        let progressBar;
        if (UNREADY_STATES.has(data.status)) {
            progressBar = (
                <div className="progress">
                    <div className="progress-bar progress-bar-value" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={progressStyle}>
                        <span className="sr-only">{progress}%</span>
                    </div>
                </div>
            );
        }

        return (
            <div className="list-group-item">
                <div className="list-group-item-heading">
                    <span className="title">
                        {this.state.project.label || this.state.project.name}
                    </span>
                    <span className="time pull-right">
                        <TimeAgo
                            date={data.date_added * 1000}
                            minPeriod={60}
                            formatter={Utils.timeAgoFormatter}
                            />
                    </span>
                </div>
                <p className="list-group-item-text">
                    { data.context.branch }<br />
                    { data.status }
                </p>

                { progressBar }
            </div>
        );
    }
}

//export default TaskItem;
