import React from 'react';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import Autocomplete from 'react-autocomplete';

import JobStore from '../../stores/JobStore';
import JenkinsStore from '../../stores/JenkinsStore';
import ConnectorStore from '../../stores/ConnectorStore';


function getLocalState() {
    let localState = {
        connectors: ConnectorStore.all,
        connectorTypes: ConnectorStore.types,
        job: {
            name: '',
            connector: '',
            connector_name: '',
            job: '',
            arguments: [],
            store: null,
            jobValues: []
        },
        rowCount: 1,
        jobName: ''
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
            action_type: Joi.any().disallow(null, '').required().label('Action type'),
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
        // keep the job
        state.job = this.state.job;
        // update job values, if store is set
        if (state.job.store) {
            state.job.jobValues = state.job.store.jobValues();
        }
        // set the number of arguments that should be displayed
        state.rowCount = state.job.arguments.length || 1;
        this.setState(state);
    }

    onFormChange(name, event) {
        this.state.job[name] = event.target.value;
        if (name == 'connector') {
            // get connector
            let connector = this.state.connectors.filter(connector => {
                return connector.id == event.target.value;
            })[0];
            if (connector) {
                // get the associated store
                this.state.job.store = this.state.connectorTypes[connector.type].store;
                this.state.job.jobValues = this.state.job.store.jobValues();
            }
        }
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
                    action_type: this.state.job.action_type,
                    job: this.state.job.job,
                    arguments: this.state.job.arguments
                });
            }
        });
    }

    addRow() {
        this.setState({rowCount: this.state.rowCount + 1});
    }

    onDelete() {
        JobStore.deleteByid(this.state.job.id);
        this.context.router.push('/settings/job/new');
    }

    render() {
        let job = this._getDataForRender();
        let name = job.name;
        let jobId = job.job;
        let args = job.arguments;
        let connectorId = job.connector || undefined;
        let connector = this.state.connectors.filter(connector => {
            return connector.id == connectorId;
        })[0];
        let connectorType = connector ? connector.type : '';
        let connectorInfo = ConnectorStore.types[connectorType] || [];
        let del;

        if (this.formName === 'Update job') {
            del = (<button type="button" className="btn btn-danger pull-left" onClick={this.onDelete.bind(this)}>Delete</button>
            );
        }

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
                            <option value='' disabled={true}>-- select an option --</option>
                            {
                                this.state.connectors.map(connector => {
                                    return <option key={connector.id} value={connector.id}>{connector.name}</option>
                                })
                            }
                        </select>
                        {this.renderHelpText(this.props.getValidationMessages('connector'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="connector-action-type" className="control-label">Action Type</label>
                        <select className="form-control" id="connector-action-type"
                                value={job.action_type}
                                onChange={this.onFormChange.bind(this, 'action_type')}>
                            <option value='' disabled={true}>-- select an option --</option>
                            {
                                (connectorInfo && connectorInfo.methods) ? connectorInfo.methods.map(action => {
                                    return <option key={action.id} value={action.id}>{action.label}</option>
                                }) : null
                            }
                        </select>
                        {this.renderHelpText(this.props.getValidationMessages('action_type'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="job-job" className="control-label">Job</label>
                        <br/>
                        <Autocomplete
                            value={this.state.job.job}
                            wrapperStyle={{
                                width: "100%",
                                display: "inline-block"
                            }}
                            inputProps={{
                                id: "job-job",
                                className: "form-control",
                                style: {
                                    width: '100%'
                                }
                            }}
                            items={this.state.job.jobValues}
                            getItemValue={(item) => item.name}
                            shouldItemRender={(item, value) => {
                                return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
                            }}
                            sortItems={(a, b, value) => {
                                return (
                                    a.name.toLowerCase().indexOf(value.toLowerCase()) >
                                    b.name.toLowerCase().indexOf(value.toLowerCase()) ? 1 : -1
                                )
                            }}
                            onChange={this.onFormChange.bind(this, 'job')}
                            onSelect={value => this.onFormChange.apply(this, ['job', {target: {value: value}}])}

                            renderItem={(item, isHighlighted) => (
                                <div
                                  style={isHighlighted ? styles.highlightedItem : styles.item}
                                  key={item.name}
                                >{item.name}</div>
                            )}
                        />
                        {this.renderHelpText(this.props.getValidationMessages('job'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="job-arguments" className="control-label">Arguments</label>
                        {
                            Array(this.state.rowCount).fill(null).map((_, i) => {
                                return (
                                    <div className="form-inline" key={'job-arguments-' + i}>
                                            <input type="text" className="form-control" style={{ width: 44 + '%' }}
                                                   id="job-arguments-name"
                                                   value={args[i] ? args[i]["name"]: ''}
                                                   placeholder="name"
                                                   onChange={this.onChangeArgument.bind(this, i, 'name')}/>
                                            <input type="text" className="form-control" style={{ width: 45 + '%' }}
                                                   id="job-arguments-value"
                                                   value={args[i] ? args[i]["value"] : ''}
                                                   placeholder="value"
                                                   onChange={this.onChangeArgument.bind(this, i, 'value')}/>
                                            <button className="btn btn-info btn-add" type="button" onClick={this.addRow.bind(this)}>
                                                <span className="glyphicon glyphicon-plus"> </span>
                                            </button>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="form-group">
                        {del}
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>
        );
    }
}

JobForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};

var styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default'
  },

  highlightedItem: {
    color: 'white',
    background: 'hsl(200, 50%, 50%)',
    padding: '2px 6px',
    cursor: 'default'
  },

  menu: {
    border: 'solid 1px #ccc'
  }
};

export { JobForm };
export default validation(strategy)(JobForm);
