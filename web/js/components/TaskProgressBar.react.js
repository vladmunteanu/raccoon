import React from 'react'

import {TASK_UNREADY_STATES} from "../constants/Constants";


class TaskProgressBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            task: this.props.task,
        };

    }

    componentWillReceiveProps(nextProps) {
        this.setState({task: nextProps.task});
    }

    render() {
        // progress bar for a running install task
        let progressBar = null;
        let now = new Date().getTime();
        let started_at = this.state.task.started_at || 0;
        let estimated_duration = this.state.task.estimated_duration || 0;
        let duration = now - started_at;
        let progress = this.state.task.status === 'SUCCESS' ? 100 : Math.round(duration * 100 / estimated_duration);


        let progressStyle = {width: progress + '%'};
        if (TASK_UNREADY_STATES.has(this.state.task.status)) {
            progressBar = (
                <div className="materialize-progress">
                    <div className={this.state.task.status === 'PENDING' ? 'indeterminate' : 'determinate'} style={progressStyle}/>
                </div>
            );
        }

        return progressBar;
    }
}

export default TaskProgressBar;
