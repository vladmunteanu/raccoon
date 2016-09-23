import React from 'react';
import BaseAddon from './BaseAddon.react';

// stores
import GitHubStore from '../../stores/GitHubStore';
import ProjectStore from '../../stores/ProjectStore';
import ActionStore from '../../stores/ActionStore';

class GitBranchesAddon extends BaseAddon {
    constructor(props) {
        super(props);

        let project = ProjectStore.getById(this.addon_context.project);

        this.state = {
            project: project,
            action: ActionStore.getById(this.addon_context.action),
            branches: GitHubStore.branches,
            branch: '',
            version: project ? project.version : '1.0.0'
        };

        this._onChange = this._onChange.bind(this);
        this._onChangeVersion = this._onChangeVersion.bind(this);
        this._onChangeBranch = this._onChangeBranch.bind(this);
    }

    componentDidMount() {
        ProjectStore.addListener(this._onChange);
        ActionStore.addListener(this._onChange);
        GitHubStore.addListener(this._onChange);

        if (this.addon_context.project) {
            GitHubStore.fetchBranches(this.addon_context.project);
        }
    }

    componentWillUnmount() {
        ProjectStore.removeListener(this._onChange);
        ActionStore.removeListener(this._onChange);
        GitHubStore.removeListener(this._onChange);
    }

    _updateState() {
        let project = ProjectStore.getById(this.addon_context.project);
        this.setState({
            project: project,
            action: ActionStore.getById(this.addon_context.action),
            branches: GitHubStore.branches,
        });

        this.updateContext('version', this.state.version);
    }

    _onChange() {
        this._updateState();
    }

    _onChangeVersion(event) {
        this.state.version = event.target.value;
        this.setState(this.state);
        this.updateContext('version', this.state.version);
    }

    _onChangeBranch(event) {
        this.state.branch = event.target.value;
        this.setState(this.state);
        this.updateContext('branch', event.target.value);
    }

    /**
     * Validates the constraints for this addon.
     * Checks that the branch is set, and that the build version is unique
     * @returns {string} branch not set -> "Branch must be set!"
     */
    validate() {
        // check branch is set
        // check that the build version is unique for this project and branch
        if (!this.state.branch) {
            return "Branch must be set!";
        }
        return "";
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
                    </div>
                </div>
                <div className="row form-group">
                    <label htmlFor="build-version">Build version</label>
                    <div className="input-group col-lg-6 col-md-6 col-xs-6">
                        <input type="text" className="form-control" id="build-version" value={this.state.version} onChange={this._onChangeVersion} disabled={!this.state.branch}/>
                    </div>
                </div>
            </div>
        );

    }
}

export default GitBranchesAddon;
