import React from 'react'

import RaccoonApp from '../RaccoonApp.react';
import AppDispatcher from '../../dispatcher/AppDispatcher';

import Addons from '../addons/Addons';

// stores
import FlowStore from '../../stores/FlowStore';
import ActionStore from  '../../stores/ActionStore';
import ProjectStore from  '../../stores/ProjectStore';
import EnvironmentStore from  '../../stores/EnvironmentStore';
import BuildStore from  '../../stores/BuildStore';
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
        project: null,
        environment: null,
        flow: flow,
        job: job,
        connector: connector,
        step: 0,
    };

    if (projectId) {
       localState.project = ProjectStore.getById(projectId);
    }

    if (envId) {
       localState.environment = EnvironmentStore.getById(envId);
    }

    return RaccoonApp.getState(localState);
}

class Flow extends React.Component {

    constructor(props) {
        super(props);
        this.step = 0;
        this.state = getLocalState(this.props.params.id,
            this.props.params.project,
            this.props.params.env);
        this._onChange = this._onChange.bind(this);
        this._handleBack = this._handleBack.bind(this);
        this._handleNext = this._handleNext.bind(this);
    }

    componentDidMount() {
        ActionStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
        FlowStore.addListener(this._onChange);
        JobStore.addListener(this._onChange);
        ConnectorStore.addListener(this._onChange);

        JobStore.fetchAll();
        ConnectorStore.fetchAll();
    }

    componentWillUnmount() {
        ActionStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
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
        let state = getLocalState(this.props.params.id,
            this.props.params.project,
            this.props.params.env);
        this.step += 1;
        state.step = this.step;
        this.setState(state);
    }

    render() {
        if (!this.state.action || !this.state.flow || !this.state.connector) {
            // loading
            return (<div></div>);
        }

        let flow = this.state.flow;
        let step_index = this.state.step;
        let LastStepAddon = this.refs[flow.id + '-LastStepAddon'];

        // create context
        let last_context = {
            action: this.state.action.id,
            project: this.state.project.id || this.state.action.project,
            environment: this.state.environment.id || this.state.action.environment,
            flow: this.state.action.flow,
        };

        if (LastStepAddon) {
            last_context = LastStepAddon.getContext();
        }

        // trigger action from FLOW
        if (step_index > flow.steps.length - 1) {
            AppDispatcher.dispatch({
                action: this.state.connector.type,
                data: {
                    method: this.state.job.action_type,
                    args: last_context,
                }
            });
            return (<div></div>);
        }

        let StepAddon = Addons.getAddon(flow.steps[step_index]);

        return (
            <div>
                <ol className="breadcrumb steps">
                    {
                        flow.steps.map(function (step, index) {
                            return (<li className={step_index == index ? "active": ""}>Step #{index}</li>);
                        })
                    }
                </ol>

                {/* display the current step in the flow */}
                <StepAddon
                    key={flow.id + '-' + step_index}
                    ref={flow.id + '-LastStepAddon'}
                    name={"Addon cu numaru' " + step_index}
                    context={last_context}
                />

                <nav>
                    <ul className="pager">
                        <li className="previous">
                            <button type="button" className={"btn btn-default " + (step_index ? "" : "disabled")} onClick={this._handleBack}>
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
