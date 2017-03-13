import React from 'react'
import NotificationSystem from 'react-notification-system';

import RaccoonApp from '../RaccoonApp.react';
import AppDispatcher from '../../dispatcher/AppDispatcher';

import Addons from '../addons/Addons';

// stores
import FlowStore from '../../stores/FlowStore';
import ActionStore from  '../../stores/ActionStore';
import JobStore from  '../../stores/JobStore';
import ConnectorStore from  '../../stores/ConnectorStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


function getLocalState(actionId, projectId=null, envId=null) {
    let action = ActionStore.getById(actionId);
    let flow = action ? FlowStore.getById(action.flow) : null;
    let job = flow ? JobStore.getById(flow.job) : null;
    let connector = job ? ConnectorStore.getById(job.connector) : null;

    if (action) {
        projectId = projectId ? projectId : action.project;
        envId = envId ? envId : action.environment;
    }

    let project = ProjectStore.getById(projectId);
    let environment = EnvironmentStore.getById(envId);

    let localState = {
        action: action,
        project: project,
        environment: environment,
        flow: flow,
        job: job,
        connector: connector,
        step: 0
    };

    return RaccoonApp.getState(localState);
}

class Flow extends React.Component {

    constructor(props) {
        super(props);

        this.state = getLocalState(
            this.props.params.id,
            this.props.params.project,
            this.props.params.env
        );
        this.state.finished = false;

        this._onChange = this._onChange.bind(this);
        this._handleBack = this._handleBack.bind(this);
        this._handleNext = this._handleNext.bind(this);
        this._handleFinish = this._handleFinish.bind(this);
    }

    componentDidMount() {
        ActionStore.addListener(this._onChange);
        FlowStore.addListener(this._onChange);
        JobStore.addListener(this._onChange);
        ConnectorStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);

        JobStore.fetchAll();
        ConnectorStore.fetchAll();
    }

    componentWillUnmount() {
        ActionStore.removeListener(this._onChange);
        FlowStore.removeListener(this._onChange);
        JobStore.removeListener(this._onChange);
        ConnectorStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    }

    componentWillReceiveProps(nextProps) {
        JobStore.fetchAll();
        ConnectorStore.fetchAll();

        let state = getLocalState(
            nextProps.params.id,
            nextProps.params.project,
            nextProps.params.env
        );
        state.step = 0;
        state.finished = false;
        this.setState(state);
    }

    _onChange() {
        let state = getLocalState(
            this.props.params.id,
            this.props.params.project,
            this.props.params.env
        );
        state.step = this.state.step;
        this.setState(state);
    }

    _handleBack(event) {
        let state = getLocalState(this.props.params.id,
            this.props.params.project,
            this.props.params.env
        );
        state.step = this.state.step - 1;
        this.setState(state);
    }

    _displayAddonErrors(errors, enableNotifications) {
        if (!this._notificationSystem) {
            this._notificationSystem = this.refs.notificationSystem;
        }
        let errorMessage = "";
        for (var key in errors) {
            errorMessage += key + ": " + errors[key] + "\n";
        }
        if (enableNotifications) {
            this._notificationSystem.addNotification({
                level: 'error',
                position: 'br',
                title: "Cannot proceed to next step:",
                message: errorMessage
            });
        }
    }

    _handleNext(event) {
        let currentAddon = this.refs[this.state.flow.id + '-LastStepAddon'];

        currentAddon.validate((error, enableNotifications) => {
            if (!error) {
                this.setState({step: this.state.step + 1});
            }
            else {
                this._displayAddonErrors(errors, enableNotifications)
            }
        });
    }

    _handleFinish(event) {
        let currentStep = this.state.step;
        let currentAddon = this.refs[this.state.flow.id + '-LastStepAddon'];

        currentAddon.validate((error, enableNotifications) => {
            if (!error) {
                currentStep += 1;

                let flow = this.state.flow;
                let LastStepAddon = this.refs[flow.id + '-LastStepAddon'];

                let lastContext = LastStepAddon.getContext();

                if (currentStep > flow.steps.length - 1) {
                    AppDispatcher.dispatch({
                        action: this.state.connector.type,
                        data: {
                            method: this.state.job.action_type,
                            args: lastContext
                        }
                    });

                    // show the taskbar
                    AppDispatcher.dispatch({
                        action: ActionTypes.TASKBAR_SHOW
                    });

                    this.setState({finished: true, step: currentStep});
                }
            }
            else {
                this._displayAddonErrors(errors, enableNotifications)
            }
        });
    }

    translateJobArguments(context) {
        let args = {};
        for (var i = 0; i < this.state.job.arguments.length; i++) {
            let arg = this.state.job.arguments[i];
            if (arg.value[0] === '$') {
                let argParts = arg.value.slice(1).split('.');
                let ctx = context;
                for (var j = 0; j < argParts.length; j++) {
                    let part = argParts[j];
                    ctx = ctx[part];
                }
                args[arg.name] = ctx;
            }
            else {
                args[arg.name] = arg.value;
            }
        }
        return args;
    }

    render() {
        if (this.state.finished) {
            // finished
            return (<div>Flow finished!</div>)
        }
        if (!this.state.action || !this.state.flow || !this.state.connector) {
            // loading
            return (<div>Loading addon...</div>);
        }

        let flow = this.state.flow;
        let stepIndex = this.state.step;
        let LastStepAddon = this.refs[flow.id + '-LastStepAddon'];

        // create context
        let lastContext = {
            action: this.state.action.id,
            project: this.state.project,
            environment: this.state.environment,
            flow_id: this.state.flow.id,
            job_id: this.state.job.id
        };

        if (LastStepAddon) {
            lastContext = LastStepAddon.getContext();
        }

        let nextButton = (
            <button type="button" className="btn btn-default" onClick={this._handleNext}>
                Next <span aria-hidden="true">&rarr;</span>
            </button>);
        // set "next" button based on step
        if (stepIndex == flow.steps.length - 1) {
            nextButton = (
            <button type="button" className="btn btn-default" onClick={this._handleFinish}>
                Finish <span aria-hidden="true">&rarr;</span>
            </button>);
        }

        let StepAddon = Addons.getAddon(flow.steps[stepIndex]);

        return (
            <div>

                {/* display the current step in the flow */}
                <StepAddon
                    key={flow.id + '-' + stepIndex}
                    ref={flow.id + '-LastStepAddon'}
                    name={"Addon-number-" + stepIndex}
                    context={lastContext}
                />

                <NotificationSystem ref="notificationSystem" />

                <nav>
                    <ul className="pager">
                        <li className="previous">
                            <button type="button" className={"btn btn-default " + (stepIndex ? "" : "disabled")} onClick={this._handleBack}>
                                <span aria-hidden="true">&larr;</span> Back
                            </button>
                        </li>
                        <li className="next">
                            {nextButton}
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default Flow;
