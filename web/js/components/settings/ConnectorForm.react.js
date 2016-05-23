import React from 'react';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import ConnectorStore from '../../stores/connectors/Connectors'; // !important for register
import localConf from '../../config/Config'
import RaccoonApp from '../RaccoonApp.react';
let ConnectorType = localConf.CONNECTOR_TYPE;

function getLocalState() {
    let localState = {
        connector: {
            name: '',
            type: '',
            config: ''
        }
    };
    return localState;
}

class ConnectorForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New connector';
        this.state = getLocalState();
        this.validatorTypes = {
            name: Joi.string().min(3).max(50).required().label('Connector name'),
            type: Joi.any().disallow(null, '').required().label('Type'),
            config: Joi.object().required().label('Config')
        };
        this.getValidatorData = this.getValidatorData.bind(this);
        this.renderHelpText = this.renderHelpText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        ConnectorStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        ConnectorStore.removeListener(this._onChange);
    }

    _onChange() {
    }

    onFormChange(name, event) {
        if (name === 'type') {
            this.state.connector.type = event.target.value;
            this.state.connector.config = JSON.stringify(ConnectorType[event.target.value], undefined, 4);
        } else if (name == 'config') {
            this.state.connector.config = event.target.value;
        } else {
            this.state.connector[name] = event.target.value;
        }
        this.setState(this.state);
        this.props.validate(name);
    }

    getValidatorData() {
        return this.state.connector;
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

    _getDataForRender() {
        return this.state.connector;
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                ConnectorStore.create({
                    name: this.state.connector.name,
                    type: this.state.connector.type,
                    config: JSON.parse(this.state.connector.config)
                });
            }
        });
    }

    onDelete() {
        ConnectorStore.deleteByid(this.state.connector.id);
        this.context.router.push('/settings/connector/new');
    }

    render() {
        let connector = this._getDataForRender();
        let name = connector.name;
        let type = connector.type;
        let config = connector.config;
        let del;

        if (this.formName === 'Update connector') {
            del = (<button type="button" className="btn btn-danger pull-left" onClick={this.onDelete.bind(this)}>Delete</button>
            );
        }

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="connector-name" className="control-label">Connector name</label>
                        <input type="text" autoComplete="off" className="form-control"
                               id="connector-name" value={name} placeholder="Connector Name"
                               onChange={this.onFormChange.bind(this, 'name')}
                               onBlur={this.props.handleValidation('name')}/>
                        {this.renderHelpText(this.props.getValidationMessages('name'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="connector-type" className="control-label">Connector Type</label><br/>
                        <select className="form-control" value={type} id="connector-type"
                                onChange={this.onFormChange.bind(this, 'type')}
                                onBlur={this.props.handleValidation('type')}>
                            <option value='' disabled={true}>-- select an option --</option>
                            {
                                Object.keys(ConnectorStore.types).map(key => {
                                    return <option value={key}>{key}</option>;
                                })
                            }
                        </select>
                        {this.renderHelpText(this.props.getValidationMessages('type'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="connector-config" className="control-label">Config</label>
                        <textarea type="text" rows="10" className="form-control"
                                  id="connector-config" value={config}
                                  onChange={this.onFormChange.bind(this, 'config')}
                                  onBlur={this.props.handleValidation('config')}/>
                         {this.renderHelpText(this.props.getValidationMessages('config'))}
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

ConnectorForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export { ConnectorForm };
export default validation(strategy)(ConnectorForm);