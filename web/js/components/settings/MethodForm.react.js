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

    onFormChange(name, event) {
        this.state.method[name] = event.target.value;
        this.setState(this.state);
        //this.props.validate(name);
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

    onChangeArgument(idxRow, key, event) {
        if (!this.state.method.arguments[idxRow]) {
            this.state.method.arguments.push({"name": "", "value": ""})
        }
        this.state.method.arguments[idxRow][key] = event.target.value;
        this.setState(this.state);
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

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit.bind(this)} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="method-name" className="control-label">Method name</label>
                        <input type="text"  className="form-control"
                               id="method-name" value={name} placeholder="Method Name"
                               onChange={this.onFormChange.bind(this, 'name')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="connector-method" className="control-label">Connector</label>
                        <select className="form-control" id="connector-method"
                                value={connectorId}
                                onChange={this.onFormChange.bind(this, 'connector')}>
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
                        <input type="text"  className="form-control"
                               id="method-method" value={meth} placeholder="api url"
                               onChange={this.onFormChange.bind(this, 'method')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="method-arguments" className="control-label">Arguments</label>
                        {
                            Array(this.state.rowCount).fill(null).map((_, i) => {
                                if (args[i]) {
                                    return <div className="form-inline" key={i}>
                                            <input type="text" className="form-control"
                                                   id="method-arguments-name"
                                                   value={args[i]["name"]}
                                                   placeholder="name"
                                                   onChange={this.onChangeArgument.bind(this, i, 'name')}/>
                                            <input type="text" className="form-control"
                                                   id="method-arguments-value"
                                                   value={args[i]["value"]}
                                                   placeholder="value"
                                                   onChange={this.onChangeArgument.bind(this, i, 'value')}/>
                                        </div>;
                                } else {
                                    return <div className="form-inline">
                                        <input type="text"
                                               className="form-control"
                                               id="method-arguments-name"
                                               placeholder="name"
                                               onChange={this.onChangeArgument.bind(this, i, 'name')}/>
                                        <input type="text"
                                               className="form-control"
                                               id="method-arguments-value"
                                               placeholder="value"
                                               onChange={this.onChangeArgument.bind(this, i, 'value')}/>
                                    </div>;
                                }
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

export default MethodForm;
