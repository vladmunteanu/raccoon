import React from 'react';
import TimeAgo from 'react-timeago';

import Utils from '../utils/Utils';

class AuditlogItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            email: props.data.user,
            action: props.data.action,
            date_added: props.data.date_added,
            project: props.data.project,
            environment: props.data.environment,
            message: props.data.message
        }
    }

    render() {
        return (
            <div className="list-group-item old">
                <div className="list-group-item-heading">
                    <span className="title text-uppercase">{this.state.action || "no action"}</span>
                </div>
                <div className="list-group-item-text">
                    {this.state.email || "no email"}<br/>
                    {this.state.project ? "Project: " + this.state.project : ""}
                    {this.state.project && this.state.environment ? " ON " : ""}
                    {this.state.environment ? "Environment: " + this.state.environment : ""}<br/><br/>
                    {this.state.message || "no message"}
                    <span className="time pull-right">
                        <TimeAgo
                            date={this.state.date_added * 1000}
                            minPeriod={60}
                            formatter={Utils.timeAgoFormatter}
                        />
                    </span>
                </div>
                <br/>
            </div>
        )
    }
}

export default AuditlogItem;