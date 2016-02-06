import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ConnectorStore from '../../stores/ConnectorStore';
import Constants from '../../constants/Constants';
import localConf from '../../config/Config'
import RaccoonApp from '../RaccoonApp.react';
let ActionTypes = Constants.ActionTypes;
let data = localConf.CONNECTOR_TYPE;

class ConnectorForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New connector';
        this.state = {
            connector: {
                name: '',
                type: '',
                config: JSON.stringify(data[Object.keys(data)[0]], undefined, 4)
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

    _onChangeConnectorType(event) {
        this.state.connector.type = event.target.value;
        this.state.connector.config = JSON.stringify(data[event.target.value], undefined, 4);
        this.setState({
            connector: this.state.connector
        });
    }

    _onChangeConfig(event) {
        this.state.connector.config = event.target.value;
        this.setState({
            connector: this.state.connector
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
                type: this.state.connector.type,
                config: JSON.parse(this.state.connector.config)
            }
        });
    }

    render() {
        let connector = this._getDataForRender();
        let name = connector.name;
        let type = connector.type;
        let config = connector.config;
        let rows = [];
        for(let key in data) {
            if(data.hasOwnProperty(key)) {
                rows.push(<option value={key}>{key}</option>);
            }
        }

        let configPrefiledForm = (
             <div className="form-group">
                <label htmlFor="connector-config" className="control-label">Config</label>
                <textarea type="text" rows="10" className="form-control" onChange={this._onChangeConfig.bind(this)}
                                  id="connector-config" value={config} />
             </div>
        );

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
                        <label htmlFor="connector-type" className="control-label">Connector Type</label><br/>
                        <select className="form-control" value={type}
                                id="connector-type" onChange={this._onChangeConnectorType.bind(this)}>
                            {rows}
                        </select>
                    </div>
                    {configPrefiledForm}
                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default ConnectorForm;