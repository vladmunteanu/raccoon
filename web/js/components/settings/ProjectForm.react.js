import React from 'react';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/tomorrow';

import ProjectStore from '../../stores/ProjectStore';
import ConnectorStore from '../../stores/ConnectorStore';
import FormValidationError from '../FormValidationError.react';


function getLocalState() {
    let localState = {
        connectors: ConnectorStore.all,
        project: {
            name: '',
            label: '',
            repo_url: '',
            connector: '',
            version: '',
            metadata: '{}'
        }
    };
    return localState;
}


class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New project';
        this.state = getLocalState();
        this.validatorTypes = {
            name: Joi.string().min(3).max(50).required().label('Project name'),
            label: Joi.string().min(3).max(50).required().label('Project label'),
            repo_url: Joi.string().uri({
                scheme: ['http', 'https']
            }).required().label('Repository url'),
            connector: Joi.any().disallow(null, '').required().label('Connector'),
            version: Joi.string().max(25).label('Project Version')
        };
        this.getValidatorData = this.getValidatorData.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this._onChange = this._onChange.bind(this);
        this.onMetadataChange = this.onMetadataChange.bind(this);
    }

    componentDidMount() {
        ProjectStore.addListener(this._onChange);
        ConnectorStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        ProjectStore.removeListener(this._onChange);
        ConnectorStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState();
        state.project = this.state.project;
        this.setState(state);
    }

    _getDataForRender() {
        return this.state.project;
    }

    onFormChange(name, event) {
        this.state.project[name] = event.target.value;
        this.setState(this.state);
        this.props.validate(name);
    }

    onMetadataChange(newMetadata) {
        this.state.project.metadata = newMetadata;
    }

    getValidatorData() {
        return this.state.project;
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                let metadata = this.state.project.metadata;
                try {
                    metadata = typeof metadata !== 'object' ? JSON.parse(metadata) : metadata;
                    ProjectStore.create({
                        name: this.state.project.name,
                        label: this.state.project.label,
                        repo_url: this.state.project.repo_url,
                        connector: this.state.project.connector,
                        version: this.state.project.version,
                        metadata: metadata
                    });
                    // reset form
                    this.setState(getLocalState());
                }
                catch (err) {
                    console.log(["Could not create project!", err]);
                }
            }
        });
    }

    onDelete() {
        ProjectStore.deleteByid(this.state.project.id);
        this.context.router.push('/settings/project/new');
    }

    render() {
        let project = this._getDataForRender();
        let name = project.name;
        let label = project.label;
        let url = project.repo_url;
        let connectorId = project.connector;
        let version = project.version;
        let metadata = project.metadata || '{}';
        let del;

        if (this.formName === 'Update project') {
            del = (<button type="button" className="btn btn-danger pull-left" onClick={this.onDelete.bind(this)}>Delete</button>);
        }

        // format metadata json
        if (typeof metadata !== 'string') {
            metadata = JSON.stringify(metadata, undefined, 4);
        }

        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="project-name" className="control-label">Project name</label>
                        <input type="text" className="form-control"
                               id="project-name" value={name}
                               placeholder="Project Name"
                               onChange={this.onFormChange.bind(this, 'name')}
                               onBlur={this.props.handleValidation('name')}/>
                        <FormValidationError key="form-errors-name" messages={this.props.getValidationMessages('name')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="project-label" className="control-label">Project label</label>
                        <input type="text"  className="form-control"
                               id="project-label" value={label}
                               placeholder="Project label"
                               onChange={this.onFormChange.bind(this, 'label')}
                               onBlur={this.props.handleValidation('label')}/>
                        <FormValidationError key="form-errors-label" messages={this.props.getValidationMessages('label')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="repo-url" className="control-label">Repository url</label>
                        <input type="text"  className="form-control"
                               id="repo-url" value={url}
                               placeholder="Repository url"
                               onChange={this.onFormChange.bind(this, 'repo_url')}
                               onBlur={this.props.handleValidation('repo_url')}/>
                        <FormValidationError key="form-errors-repo-url" messages={this.props.getValidationMessages('repo_url')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="connector-project" className="control-label">Connector</label>
                        <select className="form-control" id="connector-project"
                                value={connectorId}
                                onChange={this.onFormChange.bind(this, 'connector')}
                                onBlur={this.props.handleValidation('connector')}>
                            <option key='default' value='' disabled={true}>-- select an option --</option>
                            {
                                this.state.connectors.map(connector => {
                                    return <option key={connector.id} value={connector.id}>{connector.name}</option>
                                })
                            }
                        </select>
                        <FormValidationError key="form-errors-connector" messages={this.props.getValidationMessages('connector')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="project-version" className="control-label">Project Version</label>
                        <input type="text"  className="form-control"
                               id="project-version" value={version}
                               placeholder="Project Version"
                               onChange={this.onFormChange.bind(this, 'version')}
                               onBlur={this.props.handleValidation('version')}/>
                        <FormValidationError key="form-errors-version" messages={this.props.getValidationMessages('version')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="project-metadata" className="control-label">Metadata</label>
                        <AceEditor
                            id="project-metadata"
                            mode="json"
                            theme="tomorrow"
                            name="project-meta"
                            fontSize={12}
                            height="10em"
                            value={metadata}
                            onChange={this.onMetadataChange}
                            editorProps={{$blockScrolling: Infinity}}
                          />
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

ProjectForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export { ProjectForm };
export default validation(strategy)(ProjectForm);
