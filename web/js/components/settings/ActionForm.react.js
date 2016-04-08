import React from 'react';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import RaccoonApp from '../RaccoonApp.react';
import AppDispatcher from '../../dispatcher/AppDispatcher';

import ActionStore from '../../stores/ActionStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import FlowStore from '../../stores/FlowStore';


function getLocalState() {
    let localState = {
        flows: FlowStore.all,
        action: {
            name: '',
            label: '',
            placement: 'project',
            project: '',
            environment: '',
            flow: ''
        }
    };
    return RaccoonApp.getState(localState);
}

class ActionForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New action';
        this.state = getLocalState();
        this.validatorTypes = {
            name: Joi.string().min(3).max(50).required().label('Action name'),
            label: Joi.string().min(3).max(50).required().label('Action label')
        };
        this.getValidatorData = this.getValidatorData.bind(this);
        this.renderHelpText = this.renderHelpText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        ActionStore.addListener(this._onChange.bind(this));
        ProjectStore.addListener(this._onChange.bind(this));
        EnvironmentStore.addListener(this._onChange.bind(this));
        FlowStore.addListener(this._onChange.bind(this));
    }

    componentWillUnmount() {
        ActionStore.removeListener(this._onChange.bind(this));
        ProjectStore.removeListener(this._onChange.bind(this));
        EnvironmentStore.removeListener(this._onChange.bind(this));
        FlowStore.removeListener(this._onChange.bind(this));
    }

    _onChange() {
        let state = getLocalState();
        state.action = this.state.action;
        this.setState(state);
    }

    onFormChange(name, event) {
        this.state.action[name] = event.target.value;
        this.setState(this.state);
        this.props.validate(name);
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

    getValidatorData() {
        return this.state.action;
    }

    _getDataForRender() {
        return this.state.action;
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                ActionStore.create({
                    name: this.state.action.name,
                    label: this.state.action.label,
                    placement: this.state.action.placement,
                    project: this.state.action.project,
                    environment: this.state.action.environment,
                    flow: this.state.action.flow
                });
            }
        });
    }

    render() {
        let action = this._getDataForRender();
        let name = action.name;
        let label = action.label;
        let placement = action.placement;
        let projectId = action.project;
        let envId = action.environment;
        let flowId = action.flow;
        let placementTypes = [
            {type: "project", name: "Project"},
            {type: "environment", name: "Environment"},
            {type: "card", name: "Card"}
        ];
        let radio =  (
            <div className="form-group">
                    {
                        placementTypes.map((plc) => {
                            return (
                                <div>
                                    <input type="radio" name="placement-name" value={plc.type} checked={placement === plc.type}
                                        onChange={this.onFormChange.bind(this, 'placement')} id={"radio-" + plc.type} />
                                    <label for={"radio-" + plc.type}>{plc.name}</label>
                                </div>
                            )
                        })
                    }
            </div>
            );
        let projectPlacement = (
            <div className="form-group">
                <label htmlFor="action-project" className="control-label">Project</label>
                <div className="form-inline">
                <select className="form-control" id="action-project" value={projectId}
                        onChange={this.onFormChange.bind(this, 'project')}>
                    {/*<option value='' disabled={true}>-- select an option --</option>*/}
                    <option value=''>All projects</option>
                    {
                        this.state.projects.map(project => {
                            return <option value={project.id}>{project.label || project.name}</option>
                        })
                    }
                </select>
                </div>
            </div>
        );
        let environmentPlacement = (
            <div className="form-group">
                <label htmlFor="action-env" className="control-label">Environment</label>
                <div className="form-inline">
                <select className="form-control" id="action-env" value={envId}
                        onChange={this.onFormChange.bind(this, 'environment')}>
                    {/*<option value='' disabled={true}>-- select an option --</option>*/}
                    <option value=''>All environments</option>
                    {
                        this.state.environments.map(env => {
                            return <option value={env.id}>{env.label || env.name}</option>
                        })
                    }
                </select>
                </div>
            </div>
        );
        /*let formPlacement = (
            <div className="form-group">
                {projectPlacement}
                {environmentPlacement}
            </div>
        );*/

        /*if (placement === "project")
            formPlacement = projectPlacement;
        else if (placement === "environment")
            formPlacement = environmentPlacement;
*/
        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit} className="form-horizontal col-sm-4">
                    <div>
                    <div className="form-group">
                        <label htmlFor="action-name" className="control-label">Action name</label>
                        <input type="text"  className="form-control"
                               id="action-name" value={name} placeholder="Action Name"
                               onChange={this.onFormChange.bind(this, 'name')}
                               onBlur={this.props.handleValidation('name')} />
                        {this.renderHelpText(this.props.getValidationMessages('name'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="action-label" className="control-label">Action label</label>
                        <input type="text"  className="form-control"
                               id="action-label" value={label} placeholder="Action label"
                               onChange={this.onFormChange.bind(this, 'label')}
                               onBlur={this.props.handleValidation('label')} />
                        {this.renderHelpText(this.props.getValidationMessages('label'))}
                    </div>
                    <div className="form-group">
                        <label htmlFor="action-placement" className="control-label">Action placement</label>
                        <div className="form-inline" id="action-placement">
                            {
                                placementTypes.map((plc) => {
                                    return (
                                        <div className="form-inline">
                                            <input type="radio" name="placement-name" value={plc.type} checked={placement === plc.type}
                                                   onChange={this.onFormChange.bind(this, 'placement')} id={"radio-" + plc.type} />
                                            <label htmlFor={"radio-" + plc.type}>&nbsp;&nbsp;{plc.name}</label>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                        <div className="form-group">
                            <label htmlFor="action-project" className="control-label">Project</label>
                                <select className="form-control" id="action-project" value={projectId}
                                        onChange={this.onFormChange.bind(this, 'project')}>
                                    {/*<option value='' disabled={true}>-- select an option --</option>*/}
                                    <option value=''>All projects</option>
                                    {
                                        this.state.projects.map(project => {
                                            return <option value={project.id}>{project.label || project.name}</option>
                                        })
                                    }
                                </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="action-env" className="control-label">Environment</label>
                                <select className="form-control" id="action-env" value={envId}
                                        onChange={this.onFormChange.bind(this, 'environment')}>
                                    {/*<option value='' disabled={true}>-- select an option --</option>*/}
                                    <option value=''>All environments</option>
                                    {
                                        this.state.environments.map(env => {
                                            return <option value={env.id}>{env.label || env.name}</option>
                                        })
                                    }
                                </select>
                        </div>
                    <div className="form-group">
                        <label htmlFor="action-flow" className="control-label">Flow</label><br/>
                        <select className="form-control" id="action-flow" value={flowId}
                                onChange={this.onFormChange.bind(this, 'flow')}>
                            <option value='' disabled={true}>-- select an option --</option>
                            {
                                this.state.flows.map(flow => {
                                    return <option value={flow.id}>{flow.label || flow.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-right"/>
                    </div>
                    </div>
                </form>
            </div>
        );
    }
}

export { ActionForm };
export default validation(strategy)(ActionForm);

