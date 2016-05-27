import React from 'react';

import {TaskItem, READY_STATES, UNREADY_STATES} from './TaskItem.react';
import TaskStore from '../stores/TaskStore';


class Taskbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: TaskStore.all,
        };
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        TaskStore.addListener(this._onChange);
        TaskStore.fetchAll();
    }

    componentWillUnmount() {
        TaskStore.removeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            tasks: TaskStore.all,
        });
    }

    render() {
        return (
            <nav className="slidemenu slidemenu-vertical slidemenu-right" id="taskbar">
                {/* show tabs */}
                <ul className="nav nav-tabs" role="tablist">
                    <li role="presentation" className="active"><a href="#taskbar-running" aria-controls="running" role="tab" data-toggle="tab">Running</a></li>
                    <li role="presentation"><a href="#taskbar-history" aria-controls="history" role="tab" data-toggle="tab">History</a></li>
                </ul>

                <div className="tab-content">
                    <div role="tabpanel" className="tab-pane active" id="taskbar-running">
                        <div className="list-group">
                            {
                                this.state.tasks.sort((a, b) => {return b.date_added - a.date_added;}).map((data) => {
                                    if (UNREADY_STATES.has(data.status)) {
                                        return <TaskItem key={data.id} data={data}/>;
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div role="tabpanel" className="tab-pane" id="taskbar-history">
                        <div className="list-group">
                            {
                                this.state.tasks.sort((a, b) => {return b.date_added - a.date_added;}).map((data) => {
                                    if (READY_STATES.has(data.status)) {
                                        return <TaskItem key={data.id} data={data}/>;
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Taskbar;
