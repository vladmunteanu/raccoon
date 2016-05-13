import React from 'react'

import RaccoonApp from '../RaccoonApp.react';
import AppDispatcher from '../../dispatcher/AppDispatcher';

import Addons from "../addons/Addons";

// stores
import FlowStore from '../../stores/FlowStore';
import ActionStore from  '../../stores/ActionStore';
import BuildStore from  '../../stores/BuildStore';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


function getLocalState(action_id) {
    let action = ActionStore.getById(action_id);
    let flow = action ? FlowStore.getById(action.flow) : null;

    let localState = {
        action: action,
        flow: flow,
        step: 0,
    };
    return RaccoonApp.getState(localState);
}

class Flow extends React.Component {

    constructor(props) {
        super(props);
        this.state = getLocalState(this.props.params.id);
        this._onChange = this._onChange.bind(this);
        this._handleBack = this._handleBack.bind(this);
        this._handleNext = this._handleNext.bind(this);
    }

    componentDidMount() {
        ActionStore.addListener(this._onChange);
        FlowStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        ActionStore.removeListener(this._onChange);
        FlowStore.removeListener(this._onChange);
    }

    componentWillReceiveProps(nextProps) {
        let state = getLocalState(nextProps.params.id);
        this.step = state.step = 0;
        this.setState(state);
    }

    _onChange() {
        let state = getLocalState(this.props.params.id);
        state.step = this.step;
        this.setState(state);
    }

    _handleBack(event) {
        let state = getLocalState(this.props.params.id);
        this.step -= 1;
        state.step = this.step;
        this.setState(state);
    }

    _handleNext(event) {
        let state = getLocalState(this.props.params.id);
        this.step += 1;
        state.step = this.step;
        this.setState(state);
    }

    render() {
        if (!this.state.action || !this.state.flow) {
            // loading
            return (<div></div>);
        }

        let flow = this.state.flow;
        let step_index = this.state.step;
        let LastStepAddon = this.refs[flow.id + '-LastStepAddon'];

        // create context
        let last_context = {
            action: this.state.action.id,
            project: this.state.action.project,
            environment: this.state.environment,
            flow: this.state.action.flow,
        };

        if (LastStepAddon) {
            last_context = LastStepAddon.getContext();
        }

        // TODO (alexm): trigger action from FLOW
        if (step_index > flow.steps.length - 1) {
            AppDispatcher.dispatch({
                action: ActionTypes.BUILD_START,
                data: last_context,
            });
            BuildStore.create({
                project: last_context.project,
                branch: last_context.branch,
                version: last_context.version || '1.0.0',
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
