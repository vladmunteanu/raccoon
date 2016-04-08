import React from 'react';
import BaseAddon from './BaseAddon.react';

// stores
import GitHubStore from '../../stores/GitHubStore';
import ProjectStore from '../../stores/ProjectStore';
import ActionStore from '../../stores/ActionStore';

class GitBranchesAddon extends BaseAddon {
    constructor(props) {
        super(props);

        this.state = {
            project: ProjectStore.getById(this.addon_context.project),
            action: ActionStore.getById(this.addon_context.action),
            branches: GitHubStore.branches,
            branch: '',
        };

        this._onChange = this._onChange.bind(this);
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
        this.setState({
            project: ProjectStore.getById(this.addon_context.project),
            action: ActionStore.getById(this.addon_context.action),
            branches: GitHubStore.branches,
        });
    }

    _onChange() {
        this._updateState();
    }

    _onChangeBranch(event) {
        this.state.branch = event.target.value;
        this.setState(this.state);
        this.updateContext('branch', event.target.value);
    }

    render() {
        return (
            <div className="form-group">
                <h5>Select your branch</h5>
                <select className="form-control" value={this.state.branch} id="project-branches" onChange={this._onChangeBranch.bind(this)}>
                    <option key="" disabled>-- select an option --</option>
                    {
                        this.state.branches.map(branch => {
                            return <option key={branch.name} value={branch.name}>{branch.name}</option>
                        })
                    }
                </select>
            </div>
        );
    }
}

export default GitBranchesAddon;