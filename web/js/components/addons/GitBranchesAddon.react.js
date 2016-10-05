import React from 'react';
import Joi from 'joi';
import strategy from 'joi-validation-strategy';
import validation from 'react-validation-mixin';

import BaseAddon from './BaseAddon.react';

// stores
import GitHubStore from '../../stores/GitHubStore';
import ProjectStore from '../../stores/ProjectStore';


/**
 * Renders the build form for Git branches and build version.
 */
class BuildForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            project: this.props.project,
            branches: this.props.branches,
            version: this.props.project ? this.props.project.version : '1.0.0',
            branch: ''
        };

        this.validatorTypes = {
            branch: Joi.string().required().label('Branch'),
            version: Joi.string().required().label('Version')
        };
        this.getValidatorData = this.getValidatorData.bind(this);

        this._onChangeVersion = this._onChangeVersion.bind(this);
        this._onChangeBranch = this._onChangeBranch.bind(this);
    }

    getValidatorData() {
        return {
            branch: this.state.branch,
            version: this.state.version
        }
    }

    renderHelpText(messages) {
        return (
            <div className="text-danger">
                {
                    messages.map((message, idx) => {
                        return <div key={"error-message-" + idx}>{message}</div>
                    })
                }
            </div>
        );
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            project: nextProps.project,
            branches: nextProps.branches,
        })
    }

    _onChangeVersion(event) {
        this.setState({version: event.target.value});
    }

    _onChangeBranch(event) {
        this.setState({branch: event.target.value});
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row form-group">
                    <div className="input-group col-lg-6 col-md-6 col-xs-6">
                        <label htmlFor="build-branches">Select your branch</label>
                        <select className="form-control" value={this.state.branch} id="build-branches" onChange={this._onChangeBranch}>
                            <option key="" disabled>-- select an option --</option>
                            {
                                this.state.branches.map(branch => {
                                    return <option key={branch.name} value={branch.name}>{branch.name}</option>
                                })
                            }
                        </select>
                        {this.renderHelpText(this.props.getValidationMessages('branch'))}
                    </div>
                </div>
                <div className="row form-group">
                    <label htmlFor="build-version">Build version</label>
                    <div className="input-group col-lg-6 col-md-6 col-xs-6">
                        <input type="text" className="form-control" id="build-version" value={this.state.version} onChange={this._onChangeVersion} disabled={!this.state.branch}/>
                    </div>
                    {this.renderHelpText(this.props.getValidationMessages('version'))}
                </div>
            </div>
        )
    }
}

BuildForm = validation(strategy)(BuildForm);


class GitBranchesAddon extends BaseAddon {
    constructor(props) {
        super(props);

        this.state = {
            project: ProjectStore.getById(this.addon_context.project),
            branches: GitHubStore.branches
        };

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        ProjectStore.addListener(this._onChange);
        GitHubStore.addListener(this._onChange);

        if (this.addon_context.project) {
            GitHubStore.fetchBranches(this.addon_context.project);
        }
    }

    componentWillUnmount() {
        ProjectStore.removeListener(this._onChange);
        GitHubStore.removeListener(this._onChange);
    }

    _updateState() {
        let project = ProjectStore.getById(this.addon_context.project);
        this.setState({
            project: project,
            branches: GitHubStore.branches,
        });
    }

    _onChange() {
        this._updateState();
    }

    /**
     * Validates the constraints for this addon.
     * Checks that branch and build version are set.
     * @param callback: method to call after inner form validation is performed.
     */
    validate(callback) {
        this.refs.buildForm.validate((error) => {
            if (!error) {
                this.updateContext(
                    'version',
                    this.refs.buildForm.refs.component.state.version
                );
                this.updateContext(
                    'branch',
                    this.refs.buildForm.refs.component.state.branch
                );
            }

            // call flow callback, disable notifications
            callback(error, false);
        });
    }

    render() {
        return <BuildForm ref="buildForm" project={this.state.project} branches={this.state.branches}/>;
    }
}

export default GitBranchesAddon;
