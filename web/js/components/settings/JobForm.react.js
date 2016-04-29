import React from 'react';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import JobStore from '../../stores/JobStore';
import JenkinsStore from '../../stores/JenkinsStore';
import ConnectorStore from '../../stores/ConnectorStore';
import RaccoonApp from '../RaccoonApp.react';


function getLocalState() {
    let localState = {
        connectors: ConnectorStore.all,
        jobs: JenkinsStore.jobs,
        job: {
            name: '',
            connector: '',
            job: '',
            arguments: []
        },
        rowCount: 1
    };
    return localState;
}


class JobForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New job';
        this.state = getLocalState();
        this.validatorTypes = {
            name: Joi.string().min(3).max(50).required().label('Job name'),
            connector: Joi.any().disallow(null, '').required().label('Connector'),
            job: Joi.string().disallow(null, '').required().label('Job')
        };
        this.getValidatorData = this.getValidatorData.bind(this);
        this.renderHelpText = this.renderHelpText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        JobStore.addListener(this._onChange);
        ConnectorStore.addListener(this._onChange);
        JenkinsStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        JobStore.removeListener(this._onChange);
        ConnectorStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState();
        state.job = this.state.job;
        state.rowCount = state.job.arguments.length || 1;
        this.setState(state);
    }

    onFormChange(name, event) {
        this.state.job[name] = event.target.value;
        this.setState(this.state);
        this.props.validate(name);
    }

    getValidatorData() {
        return this.state.job;
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

    onChangeArgument(idxRow, key, event) {
        if (!this.state.job.arguments[idxRow]) {
            this.state.job.arguments[idxRow] = {
                'name': '',
                'value': ''
            };
        }
        this.state.job.arguments[idxRow][key] = event.target.value;
        this.setState(this.state);
    }

    _getDataForRender() {
        return this.state.job;
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                JobStore.create({
                    name: this.state.job.name,
                    connector: this.state.job.connector,
                    job: this.state.job.job,
                    arguments: this.state.job.arguments
                });
            }
        });
    }

    addRow() {
        this.setState({rowCount: this.state.rowCount + 1});
    }

    render() {
        let job = this._getDataForRender();
        let name = job.name;
        let connectorId = job.connector;
        let jobId = job.job;
        let args = job.arguments;

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="job-name" className="control-label">Job name</label>
                        <input type="text"  className="form-control"
                               id="job-name" value={name} placeholder="Job Name"
                               onChange={this.onFormChange.bind(this, 'name')}/>
                        {this.renderHelpText(this.props.getValidationMessages('name'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="connector-job" className="control-label">Connector</label>
                        <select className="form-control" id="connector-job"
                                value={connectorId}
                                onChange={this.onFormChange.bind(this, 'connector')}>
                            <option key='default' value='' disabled={true}>-- select an option --</option>
                            {
                                this.state.connectors.map(connector => {
                                    return <option key={connector.id} value={connector.id}>{connector.name}</option>
                                })
                            }
                        </select>
                        {this.renderHelpText(this.props.getValidationMessages('connector'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="job-job" className="control-label">Job</label>
                        <select className="form-control" id="job-job"
                                value={jobId}
                                onChange={this.onFormChange.bind(this, 'job')}>
                            <option key='default' value='' disabled={true}>-- select an option --</option>
                            {
                                this.state.jobs.map(job => {
                                    return <option key={job.name} value={job.name}>{job.name}</option>
                                })
                            }
                        </select>
                        {this.renderHelpText(this.props.getValidationMessages('job'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="job-arguments" className="control-label">Arguments</label>
                        {
                            Array(this.state.rowCount).fill(null).map((_, i) => {
                                return (
                                    <div className="form-inline" key={'job-arguments-' + i}>
                                            <input type="text" className="form-control" style={{ width: 50 + '%' }}
                                                 id="job-arguments-name"
                                                 value={args[i] ? args[i]["name"]: ''}
                                                 placeholder="name"
                                                 onChange={this.onChangeArgument.bind(this, i, 'name')}/>
                                            <input type="text" className="form-control" style={{ width: 50 + '%' }}
                                                 id="job-arguments-value"
                                                 value={args[i] ? args[i]["value"] : ''}
                                                 placeholder="value"
                                                 onChange={this.onChangeArgument.bind(this, i, 'value')}/>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-primary pull-left" onClick={this.addRow.bind(this)}>Add arguments</button>
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>
        );
    }
}

export { JobForm };
export default validation(strategy)(JobForm);
