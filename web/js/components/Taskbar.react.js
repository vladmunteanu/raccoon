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
                <span className="heading-title">Recent tasks</span>
                <div className="list-group">
                    {
                        this.state.tasks.sort((a, b) => {return b.date_added - a.date_added;}).map((data) => {
                            return <TaskItem key={data.id} data={data}/>;
                        })
                    }
                </div>
            </nav>
        );
    }
}

export default Taskbar;
