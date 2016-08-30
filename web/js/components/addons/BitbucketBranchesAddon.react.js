import React from 'react';
import BaseAddon from './BaseAddon.react';

// stores
import BitbucketStore from '../../stores/BitbucketStore';
import ProjectStore from '../../stores/ProjectStore';
import ActionStore from '../../stores/ActionStore';


class BitbucketBranchesAddon extends BaseAddon {
    constructor(props) {
        super(props);

        let project = ProjectStore.getById(this.addon_context.project);
        this.state = {
            project: project,
            action: ActionStore.getById(this.addon_context.action),
            branches: BitbucketStore.branches,
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
        BitbucketStore.addListener(this._onChange);

        if (this.addon_context.project) {
            BitbucketStore.fetchBranches(this.addon_context.project);
        }
    }

    componentWillUnmount() {
        ProjectStore.removeListener(this._onChange);
        ActionStore.removeListener(this._onChange);
        BitbucketStore.removeListener(this._onChange);
    }

    _updateState() {
        let project = ProjectStore.getById(this.addon_context.project);
        this.setState({
            project: project,
            action: ActionStore.getById(this.addon_context.action),
            branches: BitbucketStore.branches,
            version: project ? project.version : '1.0.0'
        });

        this.updateContext('version', this.state.version);
    }

    _onChange() {
        this._updateState();
    }

    _onChangeVersion(event) {
        this.state.version = event.target.value;
        this.setState(this.state);
        this.updateContext('version', event.target.value);
    }

    _onChangeBranch(event) {
        this.state.branch = event.target.value;
        this.setState(this.state);
        this.updateContext('branch', event.target.value);
    }

    render() {

        return (
            <div>
                <div className="form-group">
                    <label htmlFor="build-version">Build version</label>
                    <input type="text" className="form-control" id="build-version" value={this.state.version} onChange={this._onChangeVersion} />
                </div>
                <div className="form-group">
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
        );
    }
}

export default BitbucketBranchesAddon;
