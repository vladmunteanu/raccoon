import React from 'react';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import Autocomplete from 'react-autocomplete';
import Select from 'react-select';

import RightStore from '../../stores/RightStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import FormValidationError from '../FormValidationError.react';


function getLocalState() {
    return {
        projects: ProjectStore.all,
        environments: EnvironmentStore.all,
        right: {
            name: '',
            projects: [],
            environments: [],
        },
    };
}


class RightForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New Right';
        this.state = getLocalState();

        this.validatorTypes = {
            name: Joi.string().min(3).max(50).required().label('Right name'),
            projects: Joi.any().disallow(null, '').required().label('Projects'),
            environments: Joi.any().disallow(null, '').required().label('Environments'),
        };
        this.getValidatorData = this.getValidatorData.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
        this._onChange = this._onChange.bind(this);
        this.addProject = this.addProject.bind(this);
        this.addEnvironment = this.addEnvironment.bind(this);
    }

    componentDidMount() {
        RightStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        RightStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState();
        state.right = this.state.right;
        this.setState(state);
    }

    onFormChange(name, event) {
        let state = getLocalState();
        state.right[name] = event.target.value;
        this.setState(state);
        this.props.validate(name);
    }

    getValidatorData() {
        return this.state.right;
    }

    _getDataForRender() {
        return this.state.right;
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                RightStore.create({
                    name: this.state.right.name,
                    projects: this.state.right.projects,
                    environments: this.state.right.environments
                });
                // reset state to avoid accidental duplicates
                this.setState(getLocalState());
            }
        });
    }


    addProject(event) {
        if (event) {
            this.state.right.projects = event.split(',');
        } else {
            this.state.right.projects = [];
        }
        this.setState(this.state);
    }

    addEnvironment(event) {
        if (event) {
            this.state.right.environments = event.split(',');
        } else {
            this.state.right.environments = [];
        }
        this.setState(this.state);
    }

    onDelete() {
        RightStore.deleteByid(this.state.right.id);
        this.context.router.push('/settings/right/new');
    }

    render() {
        let right = this._getDataForRender();
        let name = right.name;
        let optionsProjects = [];
        let optionsEnvironments = [];
        let projects = this.state.right.projects;
        let environments = this.state.right.environments;
        let del;

        for (let key in this.state.projects) {
            optionsProjects.push({
                'value': this.state.projects[key].id,
                'label': this.state.projects[key].label
            })
        }

        for (let key in this.state.environments) {
            optionsEnvironments.push({
                'value': this.state.environments[key].id,
                'label': this.state.environments[key].name
            })
        }

        if (this.formName === 'Update Right') {
            del = (<button type="button" className="btn btn-danger pull-left" onClick={this.onDelete.bind(this)}>Delete</button>
            );
        }

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="Right-name" className="control-label">Right name</label>
                        <input type="text"  className="form-control"
                               id="Right-name" value={name} placeholder="Right Name"
                               onChange={this.onFormChange.bind(this, 'name')}/>
                        <FormValidationError key="form-errors-name" messages={this.props.getValidationMessages('name')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="Right-projects" className="control-label">Projects</label>
                        <Select id="select-multi" ref="selectProjects"
                                value={projects}
                                options={optionsProjects}
                                onChange={this.addProject}
                                multi={true}
                                joinValues={true}
                                delimiter=","
                                simpleValue={true}>
                        </Select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="Right-environments" className="control-label">Environments</label>
                        <Select id="select-multi" ref="selectEnvironments"
                                value={environments}
                                options={optionsEnvironments}
                                onChange={this.addEnvironment}
                                multi={true}
                                joinValues={true}
                                delimiter=","
                                simpleValue={true}>
                        </Select>
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

RightForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export { RightForm };
export default validation(strategy)(RightForm);
