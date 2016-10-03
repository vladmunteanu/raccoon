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

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


function getLocalState(actionId, projectId=null, envId=null) {
    let action = ActionStore.getById(actionId);
    let flow = action ? FlowStore.getById(action.flow) : null;
    let job = flow ? JobStore.getById(flow.job) : null;
    let connector = job ? ConnectorStore.getById(job.connector) : null;

    let localState = {
        action: action,
        project: projectId,
        environment: envId,
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
        this.step = 0;
        this.state = getLocalState(
            this.props.params.id,
            this.props.params.project,
            this.props.params.env);
        this._onChange = this._onChange.bind(this);
        this._handleBack = this._handleBack.bind(this);
        this._handleNext = this._handleNext.bind(this);
    }

    componentDidMount() {
        ActionStore.addListener(this._onChange);
        FlowStore.addListener(this._onChange);
        JobStore.addListener(this._onChange);
        ConnectorStore.addListener(this._onChange);

        JobStore.fetchAll();
        ConnectorStore.fetchAll();
    }

    componentWillUnmount() {
        ActionStore.removeListener(this._onChange);
        FlowStore.removeListener(this._onChange);
        JobStore.removeListener(this._onChange);
        ConnectorStore.removeListener(this._onChange);
    }

    componentWillReceiveProps(nextProps) {
        JobStore.fetchAll();
        ConnectorStore.fetchAll();

        let state = getLocalState(nextProps.params.id, nextProps.params.project, nextProps.params.env);
        this.step = state.step = 0;
        this.setState(state);
    }

    _onChange() {
        let state = getLocalState(this.props.params.id,
            this.props.params.project,
            this.props.params.env);
        state.step = this.step;
        this.setState(state);
    }

    _handleBack(event) {
        let state = getLocalState(this.props.params.id,
            this.props.params.project,
            this.props.params.env);
        this.step -= 1;
        state.step = this.step;
        this.setState(state);
    }

    _handleNext(event) {
        let currentAddon = this.refs[this.state.flow.id + '-LastStepAddon'];

        currentAddon.validate((error, displayError) => {
            if (!error) {
                let state = getLocalState(
                    this.props.params.id,
                    this.props.params.project,
                    this.props.params.env
                );
                this.step += 1;
                state.step = this.step;
                this.setState(state);
            }
            else {
                if (!this._notificationSystem) {
                    this._notificationSystem = this.refs.notificationSystem;
                }
                let errorMessage = "";
                for (var key in error) {
                    errorMessage += key + ": " + error[key] + "\n";
                }
                if (displayError) {
                    this._notificationSystem.addNotification({
                        level: 'error',
                        position: 'br',
                        title: "Cannot proceed to next step:",
                        message: errorMessage
                    });
                }
            }
        });
    }

    render() {
        if (!this.state.action || !this.state.flow || !this.state.connector) {
            // loading
            return (<div></div>);
        }

        let flow = this.state.flow;
        let stepIndex = this.state.step;
        let LastStepAddon = this.refs[flow.id + '-LastStepAddon'];

        // create context
        let lastContext = {
            action: this.state.action.id,
            project: this.state.project || this.state.action.project,
            environment: this.state.environment || this.state.action.environment,
            flow: this.state.action.flow
        };

        if (LastStepAddon) {
            lastContext = LastStepAddon.getContext();
        }

        // trigger action from FLOW
        if (stepIndex > flow.steps.length - 1) {
            AppDispatcher.dispatch({
                action: this.state.connector.type,
                data: {
                    method: this.state.job.action_type,
                    args: lastContext
                }
            });
            AppDispatcher.dispatch({
                action: ActionTypes.TASKBAR_SHOW
            });
            return (<div></div>);
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
                            <button type="button" className="btn btn-default" onClick={this._handleNext}>
                                Next <span aria-hidden="true">&rarr;</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default Flow;
