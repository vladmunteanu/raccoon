import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ConnectorStore from '../../stores/ConnectorStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


class ConnectorForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New connector';
        this.state = {
            connector: {
                name: '',
                config: {}
            }
        };
    }

    componentDidMount() {
        ConnectorStore.addListener(this._onChange.bind(this));
    }

    componentWillUnmount() {
        ConnectorStore.removeListener(this._onChange.bind(this));
    }

    _onChange() {
    }

    _onChangeName(event) {
        this.state.connector.name = event.target.value;
        this.setState({
            connector: this.state.connector
        });
    }

    _onChangeConfig() {
        this.state.connector.config = event.target.value;
        this.setState({
            connector: JSON.parse(this.state.connector)
        });
    }

    _getDataForRender() {
        return this.state.connector;
    }

    onSubmit(event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.CREATE_CONNECTOR,
            data: {
                name: this.state.connector.name,
                config: this.state.connector.config
            }
        });
    }

    render() {
        let connector = this._getDataForRender();
        let name = connector.name;
        let config = JSON.stringify(connector.config, undefined, 4);
        console.log("render", JSON.stringify(connector.config));

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit.bind(this)} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="connector-name" className="control-label">Connector name</label>
                        <input type="text" autoComplete="off" className="form-control" onChange={this._onChangeName.bind(this)}
                               id="connector-name" value={name} placeholder="Connector Name"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="connector-config" className="control-label">Config</label>
                        <textarea type="text" rows="10" className="form-control" onChange={this._onChangeConfig.bind(this)}
                               id="connector-config" value={config} />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default ConnectorForm;