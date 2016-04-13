import React from 'react';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import MethodStore from '../../stores/MethodStore';
import JenkinsStore from '../../stores/JenkinsStore';
import ConnectorStore from '../../stores/ConnectorStore';
import RaccoonApp from '../RaccoonApp.react';


function getLocalState() {
    let localState = {
        connectors: ConnectorStore.all,
        jobs: JenkinsStore.jobs,
        method: {
            name: '',
            connector: '',
            method: '',
            arguments: []
        },
        rowCount: 1
    };
    return localState;
}


class MethodForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New job';
        this.state = getLocalState();
        this.validatorTypes = {
            name: Joi.string().min(3).max(50).required().label('Method name'),
            connector: Joi.any().disallow(null, '').required().label('Connector'),
            method: Joi.string().disallow(null, '').required().label('Job')
        };
        this.getValidatorData = this.getValidatorData.bind(this);
        this.renderHelpText = this.renderHelpText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        MethodStore.addListener(this._onChange);
        ConnectorStore.addListener(this._onChange);
        JenkinsStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        MethodStore.removeListener(this._onChange);
        ConnectorStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState();
        state.method = this.state.method;
        state.rowCount = state.method.arguments.length || 1;
        this.setState(state);
    }

    onFormChange(name, event) {
        this.state.method[name] = event.target.value;
        this.setState(this.state);
        this.props.validate(name);
    }

    getValidatorData() {
        return this.state.method;
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
        if (!this.state.method.arguments[idxRow]) {
            this.state.method.arguments[idxRow] = {
                'name': '',
                'value': ''
            };
        }
        this.state.method.arguments[idxRow][key] = event.target.value;
        this.setState(this.state);
    }

    _getDataForRender() {
        return this.state.method;
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                MethodStore.create({
                    name: this.state.method.name,
                    connector: this.state.method.connector,
                    method: this.state.method.method,
                    arguments: this.state.method.arguments
                });
            }
        });
    }

    addRow() {
        this.setState({rowCount: this.state.rowCount + 1});
    }

    render() {
        let method = this._getDataForRender();
        let name = method.name;
        let connectorId = method.connector;
        let meth = method.method;
        let args = method.arguments;

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="method-name" className="control-label">Method name</label>
                        <input type="text"  className="form-control"
                               id="method-name" value={name} placeholder="Method Name"
                               onChange={this.onFormChange.bind(this, 'name')}/>
                        {this.renderHelpText(this.props.getValidationMessages('name'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="connector-method" className="control-label">Connector</label>
                        <select className="form-control" id="connector-method"
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
                        <label htmlFor="method-method" className="control-label">Job</label>
                        <select className="form-control" id="job-method"
                                value={meth}
                                onChange={this.onFormChange.bind(this, 'method')}>
                            <option key='default' value='' disabled={true}>-- select an option --</option>
                            {
                                this.state.jobs.map(job => {
                                    return <option key={job.name} value={job.name}>{job.name}</option>
                                })
                            }
                        </select>
                        {this.renderHelpText(this.props.getValidationMessages('method'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="method-arguments" className="control-label">Arguments</label>
                        {
                            Array(this.state.rowCount).fill(null).map((_, i) => {
                                return (
                                    <div className="form-inline" key={'method-arguments-' + i}>
                                            <input type="text" className="form-control" style={{ width: 50 + '%' }}
                                                 id="method-arguments-name"
                                                 value={args[i] ? args[i]["name"]: ''}
                                                 placeholder="name"
                                                 onChange={this.onChangeArgument.bind(this, i, 'name')}/>
                                            <input type="text" className="form-control" style={{ width: 50 + '%' }}
                                                 id="method-arguments-value"
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

export { MethodForm };
export default validation(strategy)(MethodForm);
