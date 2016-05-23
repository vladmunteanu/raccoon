import React from 'react';

import TaskItem from './TaskItem.react';
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
        console.log('Taskbar.componentDidMount');
        TaskStore.addListener(this._onChange);
        TaskStore.fetchAll();
    }

    componentWillUnmount() {
        console.log('Taskbar.componentWillUnmount');
        TaskStore.removeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            tasks: TaskStore.all,
        });
    }

    render() {
        console.log(['Taskbar.render', this.state.tasks]);
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
                                this.state.tasks.map((data) => {
                                    return <TaskItem data={data} />;
                                })
                            }
                        </div>
                    </div>
                    <div role="tabpanel" className="tab-pane" id="taskbar-history">
                        <p>Nothing to show here.</p>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Taskbar;
