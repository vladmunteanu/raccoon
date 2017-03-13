import React from 'react';
import BaseAddon from './BaseAddon.react';

// stores
import BitbucketStore from '../../stores/BitbucketStore';
import ProjectStore from '../../stores/ProjectStore';
import ActionStore from '../../stores/ActionStore';


class BitbucketBranchesAddon extends BaseAddon {
    constructor(props) {
        super(props);

        this.state = {
            project: this.addon_context.project,
            action: ActionStore.getById(this.addon_context.action),
            branches: BitbucketStore.branches,
            branch: '',
            version: this.addon_context.project.version
        };

        this.updateContext('project_id', this.addon_context.project.id);

        this._onChange = this._onChange.bind(this);
        this._onChangeVersion = this._onChangeVersion.bind(this);
        this._onChangeBranch = this._onChangeBranch.bind(this);
    }

    componentDidMount() {
        ProjectStore.addListener(this._onChange);
        ActionStore.addListener(this._onChange);
        BitbucketStore.addListener(this._onChange);

        BitbucketStore.fetchBranches(this.addon_context.project.id);
    }

    componentWillUnmount() {
        ProjectStore.removeListener(this._onChange);
        ActionStore.removeListener(this._onChange);
        BitbucketStore.removeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            project: this.addon_context.project,
            action: ActionStore.getById(this.addon_context.action),
            branches: BitbucketStore.branches,
            version: this.addon_context.project.version
        });

        this.updateContext('version', this.state.version);
    }

    _onChangeVersion(event) {
        this.updateContext('version', event.target.value);
        this.setState({version: event.target.value});
    }

    _onChangeBranch(event) {
        this.updateContext('branch', event.target.value);
        this.setState({branch: event.target.value});
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
                            this.state.branches.sort((a, b) => {
                                if (a.name == 'master') return -1;
                                if (b.name == 'master') return 1;
                                if (a.name < b.name) return -1;
                                if (a.name > b.name) return 1;
                                return 0;
                            }).map(branch => {
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
