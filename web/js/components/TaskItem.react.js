import React from 'react'


class TaskItem extends React.Component {
    render() {
        var progress = Math.round(Math.random() * 100);
        var progressStyle = {
            width: progress + '%'
        }
        return (
            <div className="list-group-item">
                <div className="list-group-item-heading">
                    <span className="title">{this.props.title}</span>
                    <span className="time pull-right">9m ago</span>
                </div>
                <p className="list-group-item-text">
                    It is a long established fact that a reader will be distracted. <br/>
                    Progress: {progress}%
                    <div className="progress">
                        <div className="progress-bar progress-bar-value" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={progressStyle}>
                            <span className="sr-only">40% Complete (success)</span>
                        </div>
                    </div>
                </p>
            </div>
        );
    }
}

export default TaskItem;