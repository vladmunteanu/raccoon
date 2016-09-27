import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TaskStore from '../stores/TaskStore';
import AuditlogStore from '../stores/AuditlogStore';
import Constants from '../constants/Constants';
let ActionTypes = Constants.ActionTypes;

import {TaskItem, READY_STATES, UNREADY_STATES} from './TaskItem.react';
import AuditlogItem from './AuditlogItem.react';


class Taskbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: TaskStore.all,
            logs: AuditlogStore.all
        };
        this._onChange = this._onChange.bind(this);

        // register for taskbar toggle event and display
        AppDispatcher.registerOnce(ActionTypes.TASKBAR_TOGGLE, _ => {
            $('#taskbar').toggleClass('slidemenu-open');
        });
        AppDispatcher.registerOnce(ActionTypes.TASKBAR_SHOW, _ => {
            $('#taskbar').addClass('slidemenu-open');
        });
    }

    componentDidMount() {
        TaskStore.addListener(this._onChange);
        AuditlogStore.addListener(this._onChange);
        TaskStore.fetchAll();
        AuditlogStore.fetchAll();
    }

    componentWillUnmount() {
        TaskStore.removeListener(this._onChange);
        AuditlogStore.removeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            tasks: TaskStore.all,
            logs: AuditlogStore.all
        });
    }

    render() {
        return (
            <div className="container slidemenu slidemenu-vertical slidemenu-right" id="taskbar">
                <ul className="nav nav-tabs" id="taskbar">
                    <li className="active" role="presentation">
                        <a className="heading-title" href="#tasks-content" data-toggle="tab">Recent tasks</a>
                    </li>
                    <li role="presentation">
                        <a className="heading-title" href="#logs-content" data-toggle="tab">Audit logs</a>
                    </li>
                </ul>
                <div className="tab-content clearfix">
                    <div className="tab-pane active" id="tasks-content">
                        <div className="list-group">
                            {
                                this.state.tasks.sort((a, b) => {return b.date_added - a.date_added;}).map((data) => {
                                    return <TaskItem key={data.id} data={data}/>;
                                })
                            }
                        </div>
                    </div>
                    <div className="tab-pane" id="logs-content">
                        <div className="list-group">
                            {
                                this.state.logs.sort((a, b) => {return b.date_added - a.date_added;}).map((log) => {
                                    return <AuditlogItem key={log.id} data={log}/>;
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Taskbar;
