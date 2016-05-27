import React from 'react';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
var ReactTags = require('react-tag-input').WithContext;

import FlowStore from '../../stores/FlowStore';
import JobStore from '../../stores/JobStore';
import Addons from '../addons/Addons'


function getLocalState() {
    return {
        jobs: JobStore.all,
        addons: Addons.all,
        flow: {
            name: '',
            steps: [],
            job: ''
        },
    };
}

class FlowForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New flow';
        this.state = getLocalState();
        this.validatorTypes = {
            name: Joi.string().min(3).max(50).required().label('Flow name'),
            job: Joi.string().min(3).max(50).required().label('Job')
        };
        this.getValidatorData = this.getValidatorData.bind(this);
        this.renderHelpText = this.renderHelpText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.addAddon = this.addAddon.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        JobStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        JobStore.removeListener(this._onChange);
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
                    job: this.state.flow.job
                });
            }
        });
    }

    onDelete() {
        FlowStore.deleteByid(this.state.flow.id);
        this.context.router.push('/settings/flow/new');
    }

    render() {
        let flow = this._getDataForRender();
        let name = flow.name;
        let steps = flow.steps;
        let jobId = flow.job;
        let del;

        if (this.formName === 'Update flow') {
            del = (<button type="button" className="btn btn-danger pull-left" onClick={this.onDelete.bind(this)}>Delete</button>
            );
        }

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
                                    return <option value={addon}>{addon}</option>;
                                })
                            }
                        </select>
                        <button className="btn btn-info pull-right"
                            onClick={this.addAddon}>
                            Add
                        </button>
                        <div className="bootstrap-tagsinput">
                            <h4>Added addons</h4>
                            {
                                    steps.map(addon => {
                                        return (
                                            <span className="tag label label-info">
                                                {addon}
                                                <span data-role="remove" />
                                            </span>
                                        );
                                    })
                                }
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="flow-job" className="control-label">Job</label><br/>
                        <select className="form-control" id="flow-job" value={jobId}
                                onChange={this.onFormChange.bind(this, 'job')}>
                            <option key='default' value='' disabled={true}>-- select an option --</option>
                            {
                                this.state.jobs.map(job => {
                                    return <option key={job.id} value={job.id}>{job.label || job.name}</option>
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                        {del}
                    </div>
                </form>
            </div>
        );
    }
}

FlowForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export { FlowForm };
export default validation(strategy)(FlowForm);

