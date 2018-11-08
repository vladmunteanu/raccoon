import React from 'react';
import TimeAgo from 'react-timeago';

import Utils from '../utils/Utils';


class CommitItem extends React.Component {
    constructor(props) {
        super(props);

        let title = this.props.commit.message;
        let skipMessage = true;
        const msg = this.props.commit.message.split('\n');
        if (msg && msg.length > 1) {
            title = msg[0];
            skipMessage = false;
        }

        this.state = {
            'author': this.props.commit.author,
            'title': title,
            'date': new Date(this.props.commit.date),
            'message': this.props.commit.message,
            'sha': this.props.commit.sha,
            'skipMessage': skipMessage
        }
    }

    render() {
        const body = (
            <pre style={{border: '0'}}>
                {this.state.message}
            </pre>
        );
        return (
            <li key={`commit-${this.state.sha}`} className="container-fluid">
                <div className="row">
                    <div className="col-sd-10 col-md-10 col-lg-10">
                        <img src={Utils.gravatarUrl(this.state.author.email)}
                                title={this.state.author.name}
                                style={{width: 17, marginRight: 8}}
                                className="img-circle"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                data-html="true"
                                data-original-title={this.state.author.name}
                        />
                        <span>
                            <b>{this.state.author.name}</b>
                            {" - " + this.state.title}
                            {this.state.skipMessage ? null: body}
                        </span>
                    </div>
                    <div className="col-sd-2 col-md-2 col-lg-2">
                        <small className="pull-right">
                            <TimeAgo
                                date={this.state.date.getTime()}
                                minPeriod={60}
                                formatter={Utils.timeAgoFormatter}
                            />
                        </small>
                    </div>
                </div>
            </li>
        )
    }
}

export default CommitItem;