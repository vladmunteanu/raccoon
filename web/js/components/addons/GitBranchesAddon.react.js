import React from 'react';
import Joi from 'joi';
import strategy from 'joi-validation-strategy';
import validation from 'react-validation-mixin';
import TimeAgo from 'react-timeago';

import BaseAddon from './BaseAddon.react';

// stores
import GitHubStore from '../../stores/GitHubStore';
import ProjectStore from '../../stores/ProjectStore';
import Utils from '../../utils/Utils';
import FormValidationError from '../FormValidationError.react';


/**
 * Renders the build form for Git branches and build version.
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
        let branchName = event.target.value;
        this.setState({branch: branchName}, () => { this.props.onBranchChange(branchName) });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row form-group">
                    <label htmlFor="build-branches">Select your branch</label>
                    <select className="form-control" value={this.state.branch} id="build-branches" onChange={this._onChangeBranch}>
                        <option key="" disabled>-- select an option --</option>
                        {
                            this.state.branches.sort((a, b) => {
                                if (a.name === 'master') return -1;
                                if (b.name === 'master') return 1;
                                if (a.name < b.name) return -1;
                                if (a.name > b.name) return 1;
                                return 0;
                            }).map(branch => {
                                return <option key={branch.name} value={branch.name}>{branch.name}</option>
                            })
                        }
                    </select>
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


class GitBranchesAddon extends BaseAddon {
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
        GitHubStore.addListener(this._onChange);

        GitHubStore.fetchBranches(this.addon_context.project.id);
    }

    componentWillUnmount() {
        ProjectStore.removeListener(this._onChange);
        GitHubStore.removeListener(this._onChange);
    }

    _updateState() {
        let commits = [];
        if (this.branch !== null) {
            commits = GitHubStore.commits;
        }
        this.setState({
            project: this.addon_context.project,
            branches: GitHubStore.branches,
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
        }, () => GitHubStore.fetchCommits(this.addon_context.project.id, branch));
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
                                let commit_date = new Date(commit.date);
                                return (
                                    <li key={`commit-${commit.sha}`} className="container-fluid">
                                        <div className="row">
                                            <div className="col-sd-10 col-md-10 col-lg-10">
                                                <img src={Utils.gravatarUrl(commit.author.email)}
                                                     title={commit.author.name}
                                                     style={{width: 17, marginRight: 8}}
                                                     className="img-circle"
                                                     data-toggle="tooltip"
                                                     data-placement="bottom"
                                                     data-html="true"
                                                     data-original-title={commit.author.name}
                                                />
                                                <span>
                                                    <b>{commit.author.name}</b>{" - " + commit.message}
                                                </span>
                                            </div>
                                            <div className="col-sd-2 col-md-2 col-lg-2">
                                                <small className="pull-right">
                                                    <TimeAgo
                                                        date={commit_date.getTime()}
                                                        minPeriod={60}
                                                        formatter={Utils.timeAgoFormatter}
                                                    />
                                                </small>
                                            </div>
                                        </div>
                                    </li>
                                )
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

export default GitBranchesAddon;
