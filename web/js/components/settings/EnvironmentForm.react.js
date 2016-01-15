import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import EnvironmentStore from '../../stores/EnvironmentStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


class EnvironmentForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New environment';
        this.state = {
            environment: {
                name: ''
            }
        };
    }

    componentDidMount() {
        EnvironmentStore.addListener(this._onChange.bind(this));
    }

    componentWillUnmount() {
        EnvironmentStore.removeListener(this._onChange.bind(this));
    }

    _onChange() {
    }

    _onChangeName(event) {
        this.state.environment.name = event.target.value;
        this.setState({
            environment: this.state.environment
        });
    }

    _getDataForRender() {
        return this.state.environment;
    }

    onSubmit(event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.CREATE_ENVIRONMENT,
            data: {
                name: this.state.environment.name
            }
        });
    }

    render() {
        let environment = this._getDataForRender();
        let name = environment.name;

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit.bind(this)} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="environment-name" className="control-label">Environment name</label>
                        <input type="text" autoComplete="off" className="form-control" onChange={this._onChangeName.bind(this)}
                               id="environment-name" value={name} placeholder="Environment Name"/>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default EnvironmentForm;