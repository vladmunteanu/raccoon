import React from 'react';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import EnvironmentStore from '../../stores/EnvironmentStore';
import RaccoonApp from '../RaccoonApp.react';

class EnvironmentForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New environment';
        this.state = {
            environment: {
                name: ''
            }
        };
        this.validatorTypes = {
            name: Joi.string().min(3).max(50).required().label('Environment name')
        };
        this.getValidatorData = this.getValidatorData.bind(this);
        this.renderHelpText = this.renderHelpText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        EnvironmentStore.addListener(this._onChange.bind(this));
    }

    componentWillUnmount() {
        EnvironmentStore.removeListener(this._onChange.bind(this));
    }

    _onChange() {
    }

    onFormChange(name, event) {
        this.state.environment[name] = event.target.value;
        this.setState({
            environment: this.state.environment
        });
        this.props.validate(name);
    }

    _getDataForRender() {
        return this.state.environment;
    }

    getValidatorData() {
        return this.state.environment;
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

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                EnvironmentStore.create({
                    name: this.state.environment.name
                });
            }
        });
    }

    render() {
        let environment = this._getDataForRender();
        let name = environment.name;

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="environment-name" className="control-label">Environment name</label>
                        <input type="text" autoComplete="off" className="form-control"
                               id="environment-name" value={name}
                               placeholder="Environment Name"
                               onChange={this.onFormChange.bind(this, 'name')}
                               onBlur={this.props.handleValidation('name')}/>
                        {this.renderHelpText(this.props.getValidationMessages('name'))}
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>
        );
    }
}

export { EnvironmentForm };
export default validation(strategy)(EnvironmentForm);