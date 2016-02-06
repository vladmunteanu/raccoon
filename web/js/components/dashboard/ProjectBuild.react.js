import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';

import ConnectorStore from '../../stores/ConnectorStore';
import ProjectStore from '../../stores/ProjectStore';
import ActionStore from '../../stores/ActionStore';
import GitHubStore from '../../stores/GitHubStore';
import JenkinsStore from '../../stores/JenkinsStore';

import localConf from '../../config/Config'
import RaccoonApp from '../RaccoonApp.react';

import Constants from '../../constants/Constants';
let ActionTypes = Constants.ActionTypes;

class ProjectBuild extends React.Component {
    constructor(props) {
        super(props);

        GitHubStore.fetchBranches(this.props.params.id);

        this.state = {
            project: ProjectStore.getById(this.props.params.id),
            action: ActionStore.getById(this.props.params.action_id),
            branches: GitHubStore.branches,
            branch: '',
        };
    }

    componentDidMount() {
        ProjectStore.addListener(this._onChange.bind(this));
        ActionStore.addListener(this._onChange.bind(this));
        GitHubStore.addListener(this._onChange.bind(this));
    }

    componentWillUnmount() {
        ProjectStore.removeListener(this._onChange.bind(this));
        ActionStore.removeListener(this._onChange.bind(this));
        GitHubStore.removeListener(this._onChange.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id != this.props.params.id) {
            GitHubStore.fetchBranches(nextProps.params.id);
            this._updateState(nextProps.params);
        }
    }

    _updateState(params) {
        params = params || this.props.params;
        this.setState({
            project: ProjectStore.getById(params.id),
            action: ActionStore.getById(params.action_id),
            branches: GitHubStore.branches,
        });
    }

    _onChange() {
        this._updateState();
    }

    _onChangeBranch(event) {
        this.state.branch = event.target.value;
        this.setState(this.state);
    }

    _onSubmit(event) {
        event.preventDefault();
        console.log('aaaaaaaa dispatch');
        AppDispatcher.dispatch({
            action: ActionTypes.BUILD_START,
            data: {
                branch: this.state.branch,
                //project: this.state.project.id,
                action: this.state.action.id,
            }
        });
    }

    render() {
        return (
            <div className="container">
                <h3>{this.state.project ? this.state.project.label : ''}</h3>
                <form onSubmit={this._onSubmit.bind(this)} className="form-inline">
                    <div className="form-group">
                        <select className="form-control" value={this.state.branch} id="project-branches" onChange={this._onChangeBranch.bind(this)}>
                            <option key="" disabled>-- select an option --</option>
                            {
                                this.state.branches.map(branch => {
                                    return <option key={branch.name} value={branch.name}>{branch.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">{this.state.action ? this.state.action.label : ''}</button>
                </form>
            </div>
        );
    }
}

export default ProjectBuild;