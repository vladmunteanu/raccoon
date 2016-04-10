import React from 'react';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import FlowStore from '../../stores/FlowStore';
import MethodStore from '../../stores/MethodStore';
import Addons from '../addons/Addons'


function getLocalState() {
    let localState = {
        methods: MethodStore.all,
        addons: Addons.all,
        flow: {
            name: '',
            steps: [],
            method: ''
        }
    };
    return localState;
}

class FlowForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New flow';
        this.state = getLocalState();
        this.validatorTypes = {
            name: Joi.string().min(3).max(50).required().label('Flow name'),
            method: Joi.string().min(3).max(50).required().label('Method')
        };
        this.getValidatorData = this.getValidatorData.bind(this);
        this.renderHelpText = this.renderHelpText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.addAddon = this.addAddon.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        MethodStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        MethodStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState();
        state.flow = this.state.flow;
        this.setState(state);
    }

    onFormChange(name, event) {
        this.state.flow[name] = event.target.value;
        this.setState(this.state);
        this.props.validate(name);
    }

    renderHelpText(messages) {
        return (
            <div className="text-danger">
                {
                    messages.map(message => {
                        return <div>{message}</div>
                    })
                }
            </div>
        );
    }

    getValidatorData() {
        return this.state.flow;
    }

    _getDataForRender() {
        return this.state.flow;
    }

    addAddon(event) {
        this.state.flow.steps.push(this.refs.selectAddon.getDOMNode().value);
        this.setState(this.state);
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                FlowStore.create({
                    name: this.state.flow.name,
                    steps: this.state.flow.steps,
                    method: this.state.flow.method
                });
            }
        });
    }

    render() {
        let flow = this._getDataForRender();
        let name = flow.name;
        let steps = flow.steps;
        let methodId = flow.method;


        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="flow-name" className="control-label">Flow name</label>
                        <input type="text"  className="form-control"
                               id="flow-name" value={name} placeholder="Flow Name"
                               onChange={this.onFormChange.bind(this, 'name')}
                               onBlur={this.props.handleValidation('name')} />
                        {this.renderHelpText(this.props.getValidationMessages('name'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="flow-addon" className="control-label">Addons</label><br/>
                        <select className="form-control" id="flow-addon" ref="selectAddon">
                            <option value='' disabled={true}>-- select an option --</option>
                            {
                                this.state.addons.map(addon => {
                                    return <option value={addon}>{addon}</option>
                                })
                            }
                        </select>
                        <button className="btn btn-info pull-right"
                            onClick={this.addAddon}>
                            Add
                        </button>
                        <div>
                            <h4>Added addons</h4>
                            {
                                steps.map(addon => {
                                    return <p>{addon}</p>
                                })
                            }
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="flow-method" className="control-label">Method</label><br/>
                        <select className="form-control" id="flow-method" value={methodId}
                                onChange={this.onFormChange.bind(this, 'method')}>
                            <option value='' disabled={true}>-- select an option --</option>
                            {
                                this.state.methods.map(method => {
                                    return <option value={method.id}>{method.label || method.name}</option>
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>
        );
    }
}

export { FlowForm };
export default validation(strategy)(FlowForm);

