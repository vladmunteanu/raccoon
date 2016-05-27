import React from 'react'
import TimeAgo from 'react-timeago'

import Utils from '../utils/Utils';


class TaskItem extends React.Component {
    render() {
        let now = new Date().getTime();
        let started_at = this.props.data.started_at || 0;
        let estimated_duration = this.props.data.estimated_duration || 0;

        let duration = now - started_at;
        let progress = Math.round(duration * 100 / estimated_duration);
        if (this.props.data.status == 'SUCCESS') {
            progress = 100;
        }

        let progressStyle = {
            width: progress + '%'
        };

        return (
            <div className="list-group-item">
                <div className="list-group-item-heading">
                    <span className="title">{this.props.data.context.project}</span>
                    <span className="time pull-right">
                        <TimeAgo
                            date={this.props.data.date_added * 1000}
                            minPeriod={60}
                            formatter={Utils.timeAgoFormatter}
                            />
                    </span>
                </div>
                <p className="list-group-item-text">
                    {this.props.data.context.branch}<br />
                    Progress: {progress}% ({ this.props.data.status })
                </p>
                <div className="progress">
                    <div className="progress-bar progress-bar-value" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={progressStyle}>
                        <span className="sr-only">{progress}%</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default TaskItem;
