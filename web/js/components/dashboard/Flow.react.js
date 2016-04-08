import React from 'react'

import RaccoonApp from '../RaccoonApp.react';

import Addons from "../addons/Addons";

import FlowStore from '../../stores/FlowStore';
import ActionStore from  '../../stores/ActionStore';


function getLocalState(action_id) {
    let action = ActionStore.getById(action_id);
    if (action) {
        action.flow = "56f52309fb6329100ec1853f"; // TODO (alexm): remove this dummy flow id
    }

    let flow = action ? FlowStore.getById(action.flow) : null;

    let localState = {
        action: action,
        flow: flow,
        step: 0,
    };
    return RaccoonApp.getState(localState);
}

let Flow = React.createClass({
    step: 0,

    getInitialState: function () {
        return getLocalState(this.props.params.id);
    },

    componentDidMount: function() {
        ActionStore.addListener(this._onChange);
        FlowStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActionStore.removeListener(this._onChange);
        FlowStore.removeListener(this._onChange);
    },

    componentWillReceiveProps: function (nextProps) {
        let state = getLocalState(this.props.params.id);
        this.step = state.step = 0;
        this.setState(state);
    },

    _onChange: function() {
        let state = getLocalState(this.props.params.id);
        state.step = this.step;
        this.setState(state);
    },

    _handleBack: function (event) {
        let state = getLocalState(this.props.params.id);
        this.step -= 1;
        state.step = this.step;
        this.setState(state);
    },
    _handleNext: function (event) {
        let state = getLocalState(this.props.params.id);
        this.step += 1;
        state.step = this.step;
        this.setState(state);
    },

    render: function () {
        let flow = this.state.flow;
        let step_index = this.state.step;
        let LastStepAddon = this.refs['LastStepAddon'];
        let last_context = {};

        if (LastStepAddon) {
            last_context = LastStepAddon.getContext();
        }


        if (step_index > flow.steps.length - 1) {
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

                <h4>This is a flow</h4>

                {/* display the current step in the flow */}
                <StepAddon
                    ref="LastStepAddon"
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
});

export default Flow;
