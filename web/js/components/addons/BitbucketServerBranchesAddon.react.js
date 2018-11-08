import React from 'react';
import Joi from 'joi';
import strategy from 'joi-validation-strategy';
import validation from 'react-validation-mixin';
import TimeAgo from 'react-timeago';
import Select from 'react-select';

import BaseAddon from './BaseAddon.react';
import CommitItem from '../CommitItem.react';

// stores
import BitbucketServerStore from '../../stores/BitbucketServerStore';
import ProjectStore from '../../stores/ProjectStore';
import Utils from '../../utils/Utils';
import FormValidationError from '../FormValidationError.react';


/**
 * Renders the build form for BitbucketServer branches and build version.
 */
class BuildForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            project: this.props.project,
            branches: this.props.branches,
            version: this.props.project.version,
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
        let branchName = event;
        this.setState({branch: branchName}, () => { this.props.onBranchChange(branchName) });
    }

    render() {
        let options = [];
        this.state.branches.sort((a, b) => {
            if (a.name == 'master') return -1;
            if (b.name == 'master') return 1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        }).map(branch => {
            options.push({
                'value': branch.name,
                'label': branch.name
            })
        })

        return (
            <div className="container-fluid">
                <div className="row form-group">
                    <label htmlFor="build-branches">Select your branch</label>
                    <Select
                        id="build-branches"
                        ref="selectBranch"
                        autoFocus
                        options={options}
                        simpleValue
                        value={this.state.branch}
                        onChange={this._onChangeBranch}
                        searchable={this.state.searchable}
                    />
                    <FormValidationError key="form-errors-branch" messages={this.props.getValidationMessages('branch')}/>
                </div>
                <div className="row form-group">
                    <label htmlFor="build-version">Build version</label>
                    <input type="text" className="form-control" id="build-version" value={this.state.version} onChange={this._onChangeVersion} disabled={!this.state.branch}/>
                    <FormValidationError key="form-errors-version" messages={this.props.getValidationMessages('version')}/>
                </div>
            </div>
        )
    }
}

BuildForm = validation(strategy)(BuildForm);


class BitbucketServerBranchesAddon extends BaseAddon {
    constructor(props) {
        super(props);

        this.state = {
            project: this.addon_context.project,
            branches: [],
            commits: []
        };

        this.branch = null;
        this._onChange = this._onChange.bind(this);
        this.onBranchChange = this.onBranchChange.bind(this);
    }

    componentDidMount() {
        ProjectStore.addListener(this._onChange);
        BitbucketServerStore.addListener(this._onChange);

        BitbucketServerStore.fetchBranches(this.addon_context.project.id);
    }

    componentWillUnmount() {
        ProjectStore.removeListener(this._onChange);
        BitbucketServerStore.removeListener(this._onChange);
    }

    _updateState() {
        let commits = [];
        if (this.branch !== null) {
            commits = BitbucketServerStore.commits;
        }
        this.setState({
            project: this.addon_context.project,
            branches: BitbucketServerStore.branches,
            commits: commits
        });
    }

    _onChange() {
        this._updateState();
    }

    onBranchChange(branch) {
        this.branch = branch;
        this.setState({
            commits: []
        }, () => BitbucketServerStore.fetchCommits(this.addon_context.project.id, this.branch));
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
        let commitsComponent = null;
        if (this.state.commits.length > 0) {
            commitsComponent = (
                <div className="col-sm-6 col-md-6 col-lg-6" style={{height: 400, overflow: "auto"}}>
                    <ul className="media-list">
                        {
                            this.state.commits.map(commit => {
                                return <CommitItem key={'commit-' + commit.sha} commit={commit}/>;
                            })
                        }
                    </ul>
                </div>
            );
        }
        return (
            <div className="container-fluid">
                <h3>Build {this.state.project.label}</h3>
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <BuildForm
                            ref="buildForm"
                            project={this.state.project}
                            branches={this.state.branches}
                            onBranchChange={this.onBranchChange}
                        />
                    </div>
                    {commitsComponent}
                </div>
            </div>
        );
    }
}

export default BitbucketServerBranchesAddon;
