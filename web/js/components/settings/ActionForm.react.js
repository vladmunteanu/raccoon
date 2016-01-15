import React from 'react';

import RaccoonApp from '../RaccoonApp.react';
import AppDispatcher from '../../dispatcher/AppDispatcher';

import ActionStore from '../../stores/ActionStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import MethodStore from '../../stores/MethodStore';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;


function getLocalState() {
    let localState = {
        methods: MethodStore.all,
        action: {
            name: '',
            label: '',
            project: null,
            environment: null,
            method: null,
        }
    };
    return RaccoonApp.getState(localState);
}

class ActionForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New action';
        this.state = getLocalState();
    }

    componentDidMount() {
        ActionStore.addListener(this._onChange.bind(this));
        ProjectStore.addListener(this._onChange.bind(this));
        EnvironmentStore.addListener(this._onChange.bind(this));
        MethodStore.addListener(this._onChange.bind(this));
    }

    componentWillUnmount() {
        ActionStore.removeListener(this._onChange.bind(this));
        ProjectStore.removeListener(this._onChange.bind(this));
        EnvironmentStore.removeListener(this._onChange.bind(this));
        MethodStore.removeListener(this._onChange.bind(this));
    }

    _onChange() {
        let state = getLocalState();
        state.action = this.state.action;
        this.setState(state);
    }

    _onChangeName(event) {
        this.state.action.name = event.target.value;
        this.setState(this.state);
    }

    _onChangeLabel(event) {
        this.state.action.label = event.target.value;
        this.setState(this.state);
    }

    _onChangeProject(event) {
        this.state.action.project = event.target.value;
        this.setState(this.state);
    }

    _onChangeEnvironment(event) {
        this.state.action.environment = event.target.value;
        this.setState(this.state);
    }

    _onChangeMethod(event) {
        this.state.action.method = event.target.value;
        this.setState(this.state);
    }

    _getDataForRender() {
        return this.state.action;
    }

    onSubmit(event) {
        event.preventDefault();
        AppDispatcher.dispatch({
            action: ActionTypes.CREATE_ACTION,
            data: {
                name: this.state.action.name,
                label: this.state.action.label,
                project: this.state.action.project,
                environment: this.state.action.environment,
                method: this.state.action.method,
            }
        });
    }

    render() {
        let action = this._getDataForRender();
        let name = action.name;
        let label = action.label;
        let projectId = action.project;
        let envId = action.environment;
        let methodId = action.method;


        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit.bind(this)} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="action-name" className="control-label">Action name</label>
                        <input type="text"  className="form-control" onChange={this._onChangeName.bind(this)}
                               id="action-name" value={name} placeholder="Action Name"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="action-label" className="control-label">Action label</label>
                        <input type="text"  className="form-control" onChange={this._onChangeLabel.bind(this)}
                               id="action-label" value={label} placeholder="Action label"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="action-project" className="control-label">Project</label><br/>
                        <select className="form-control" id="action-project" value={projectId} onChange={this._onChangeProject.bind(this)}>
                            <option disabled>-- select an option --</option>
                            {
                                this.state.projects.map(project => {
                                    return <option value={project.id}>{project.label || project.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="action-env" className="control-label">Environment</label><br/>
                        <select className="form-control" id="action-env" value={envId} onChange={this._onChangeEnvironment.bind(this)}>
                            <option disabled>-- select an option --</option>
                            {
                                this.state.environments.map(env => {
                                    return <option value={env.id}>{env.label || env.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="action-method" className="control-label">Method</label><br/>
                        <select className="form-control" id="action-method" value={methodId} onChange={this._onChangeMethod.bind(this)}>
                            <option disabled>-- select an option --</option>
                            {
                                this.state.methods.map(method => {
                                    return <option value={method.id}>{method.label || method.name}</option>
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default ActionForm;

