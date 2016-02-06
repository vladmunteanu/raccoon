import React from 'react';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ConnectorStore from '../../stores/ConnectorStore';
import ProjectStore from '../../stores/ProjectStore';
import ActionStore from '../../stores/ActionStore';
import GitHubStore from '../../stores/GitHubStore';
import Constants from '../../constants/Constants';
import localConf from '../../config/Config'
import RaccoonApp from '../RaccoonApp.react';
import Connector from '../../utils/Connector';

class ProjectBuild extends React.Component {
    constructor(props) {
        super(props);

        GitHubStore.fetchBranches(this.props.params.id);

        this.state = {
            project: ProjectStore.getById(this.props.params.id),
            action: ActionStore.getById(this.props.params.action_id),
            branches: GitHubStore.branches,
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

    render() {
        return (
            <div className="container">
                <h3>{this.state.project ? this.state.project.label : ''}</h3>
                <form className="form-inline">
                    <div className="form-group">
                        <select className="form-control" defaultValue="default" id="project-branches">
                            <option key="default" disabled>-- select an option --</option>
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