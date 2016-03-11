import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import MethodStore from '../../stores/MethodStore';
import ConnectorStore from '../../stores/ConnectorStore';
import RaccoonApp from '../RaccoonApp.react';
import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;

function getLocalState() {
    let localState = {
        connectors: ConnectorStore.all,
        method: {
            name: '',
            connector: null,
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
        this.formName = 'New method';
        this.state = getLocalState();
    }

    componentDidMount() {
        MethodStore.addListener(this._onChange.bind(this));
        ConnectorStore.addListener(this._onChange.bind(this));
    }

    componentWillUnmount() {
        MethodStore.removeListener(this._onChange.bind(this));
        ConnectorStore.removeListener(this._onChange.bind(this));
    }

    _onChange() {
        let state = getLocalState();
        state.method = this.state.method;
        this.setState(state);
    }

    _onChangeName(event) {
        this.state.method.name = event.target.value;
        this.setState({
            method: this.state.method
        });
    }

    _onChangeConnector(event) {
        this.state.method.connector = event.target.value;
        this.setState({
            method: this.state.method
        });
    }

    _onChangeMethod(event) {
        this.state.method.method = event.target.value;
        this.setState({
            method: this.state.method
        });
    }

    _onChangeArgumentName(event) {
        if (this.state.method.arguments[event.target.getAttribute('data-id')]){
            this.state.method.arguments[event.target.getAttribute('data-id')]["name"] = event.target.value;
        }else{
            this.state.method.arguments.push({"name": event.target.value, "value": ""})
        }
        this.setState({
            method: this.state.method
        });
    }

    _onChangeArgumentValue(event) {
        if (this.state.method.arguments[event.target.getAttribute('data-id')]){
            this.state.method.arguments[event.target.getAttribute('data-id')]["value"] = event.target.value;
        }else{
            this.state.method.arguments.push({"name": "", "value": event.target.value})
        }
        this.setState({
            method: this.state.method
        });
    }

    _getDataForRender() {
        return this.state.method;
    }

    onSubmit(event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.CREATE_METHOD,
            data: {
                name: this.state.method.name,
                connector: this.state.method.connector,
                method: this.state.method.method,
                arguments: this.state.method.arguments
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
        let inputs = [];
        for (let i=0; i<this.state.rowCount; i++) {
            inputs.push(i);
        }

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit.bind(this)} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="method-name" className="control-label">Method name</label>
                        <input type="text"  className="form-control" onChange={this._onChangeName.bind(this)}
                               id="method-name" value={name} placeholder="Method Name"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="connector-method" className="control-label">Connector</label>
                        <select className="form-control" id="connector-method" value={connectorId} onChange={this._onChangeConnector.bind(this)}>
                            <option disabled>-- select an option --</option>
                            {
                                this.state.connectors.map(connector => {
                                    return <option key={connector.id} value={connector.id}>{connector.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="method-method" className="control-label">Method method</label>
                        <input type="text"  className="form-control" onChange={this._onChangeMethod.bind(this)}
                               id="method-method" value={meth} placeholder="api url"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="method-arguments" className="control-label">Arguments</label>
                        {inputs.map(arg => {
                            if (args[arg]) {
                                return <div className="form-inline" key={arg}>
                                    <input type="text" className="form-control" id="method-arguments-name" value={args[arg]["name"]}
                                           placeholder="name" data-id={arg} onChange={this._onChangeArgumentName.bind(this)}/>
                                    <input type="text" className="form-control" id="method-arguments-value" value={args[arg]["value"]}
                                           placeholder="value" data-id={arg} onChange={this._onChangeArgumentValue.bind(this)}/>
                                </div>;
                            } else {
                                return <div className="form-inline" key={arg}>
                                    <input type="text" className="form-control" id="method-arguments-name"
                                           placeholder="name" data-id={arg} onChange={this._onChangeArgumentName.bind(this)}/>
                                    <input type="text" className="form-control" id="method-arguments-value"
                                           placeholder="value" data-id={arg} onChange={this._onChangeArgumentValue.bind(this)}/>
                                </div>;
                            }
                        })}
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

export default MethodForm;
