import React from 'react';

import AppDispatcher from '../dispatcher/AppDispatcher';
import TaskStore from '../stores/TaskStore';
import Constants from '../constants/Constants';
let ActionTypes = Constants.ActionTypes;

import {TaskItem, READY_STATES, UNREADY_STATES} from './TaskItem.react';



class Taskbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: TaskStore.all,
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
