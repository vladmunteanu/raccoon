import React from 'react';

import TaskProgressBar from '../TaskProgressBar.react';

// stores
import BaseAddon from './BaseAddon.react';
import EnvironmentStore from '../../stores/EnvironmentStore';
import TaskStore from "../../stores/TaskStore";
import ProjectStore from "../../stores/ProjectStore";


// Environments excluded from the install checks
const SAFE_ENVIRONMENTS = new Set(['DEV', 'TEST', 'ACC', 'BETA-ACC']);


class CheckInstallsAddon extends BaseAddon {
    constructor(props) {
        super(props);

        this.state = {
            environment: this.addon_context.environment,
            tasksInProgress: [],
            confirmed: false
        };

        this._onChange = this._onChange.bind(this);
        this._onConfirm = this._onConfirm.bind(this);
    }

    componentDidMount() {
        TaskStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);

        TaskStore.fetchAll();
    }

    componentWillUnmount() {
        TaskStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    }

    /**
     * Reacts to TaskStore and EnvironmentStore changes
     * to compute the list of in progress install tasks.
     * @private
     */
    _onChange() {
        let tasks = TaskStore.all.filter(task => {
            let environment = EnvironmentStore.getById(task.environment);

            if (!environment) return false;

            return (
                environment.id === this.state.environment.id &&
                (task.status === 'STARTED' || task.status === 'PENDING') &&
                task.connector_type === 'jenkins' &&
                task.action_type === 'install'
            );
        });

        // sort descending by date_added
        tasks.sort((a, b) => {return b.date_added - a.date_added});
        if (
            tasks.length === 0 ||
            SAFE_ENVIRONMENTS.has(this.state.environment.name.toUpperCase())
        ) {
            this.setState({confirmed: true});
        }
        this.setState({tasksInProgress: tasks});
    }

    _onConfirm(e) {
        const target = e.target;
        this.setState({confirmed: target.checked});
    }

    validate(callback) {
        let error = this.state.confirmed ? null : {"Ongoing installs": "Please confirm your action!"};
        // call flow callback, enable notifications
        callback(error, true);
    }

    render() {
        let envName = this.state.environment.name.toUpperCase();
        if (SAFE_ENVIRONMENTS.has(envName)) {
            return (<h3>Safe to proceed on environment {envName}.</h3>);
        }

        if (this.state.tasksInProgress.length === 0) {
            if (this.state.confirmed) {
                return <h3>Hooray! There are no ongoing installs on {envName} right now</h3>
            }
            return <h3>Checking ongoing installs on {envName}</h3>
        }
        return (
            <div className="container-fluid">
                <h2>Ongoing installs on {envName}</h2>
                <div className="row">
                    <div className="col-sm-6">
                        <ul className="media-list">
                            {
                                this.state.tasksInProgress.map((task, idx) => {
                                    let project = ProjectStore.getById(task.project);
                                    return (
                                        <div key={'ongoing-install-' + idx}>
                                            <div>{project.label}</div>
                                            <TaskProgressBar task={task}/>
                                        </div>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div>
                    <p>There are { this.state.tasksInProgress.length } ongoing installs currently on { envName }</p>
                    <label>
                        Are you sure you want to proceed installing { this.addon_context.project.label } ? &nbsp; &nbsp;
                        <input name="confirmInstall" type="checkbox" checked={this.state.confirmed} onChange={this._onConfirm}/>
                    </label>
                </div>
            </div>
        );
    }
}

export default CheckInstallsAddon;
