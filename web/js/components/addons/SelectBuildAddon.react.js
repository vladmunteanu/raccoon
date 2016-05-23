import React from 'react';
import BaseAddon from './BaseAddon.react';
import BuildStore from '../../stores/BuildStore';
import Utils from '../../utils/Utils';

function getLocalState(projectId) {
    return {
        builds: BuildStore.filter(projectId),
        selectedBuild: null,
    }
}

class SelectBuildAddon extends BaseAddon {
    constructor(props) {
        super(props);
        this.state = getLocalState(this.props.context.project);
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        BuildStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        BuildStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState(this.props.context.project);
        this.setState(state);
    }
    
    _onBuildSelect(buildId, event) {
        let build = BuildStore.getById(buildId);
        this.state.selectedBuild = build;
        this.setState(this.state);
    }

    render() {
        let changelog = (<div>No build selected!!!</div>);
        if (this.state.selectedBuild) {
            changelog = (
                <div style={{height: 400, overflow: "auto"}}>
                    <ul className="media-list">
                        {
                            this.state.selectedBuild.changelog.map(commit => {
                                return (
                                    <li className="media">
                                        <div className="media-left">
                                            <img src={Utils.gravatarUrl(commit.author.email)}
                                                 title={commit.author.name}
                                                 style={{width: 17}}
                                                 className="img-circle"
                                                 data-toggle="tooltip"
                                                 data-placement="bottom"
                                                 data-html="true"
                                                 data-original-title="Alexandru Mihai<br/>23-05-2015 2:00 PM"
                                            />
                                        </div>
                                        <div className="media-body">
                                            {commit.message}
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
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <h3 className="text-center">Select a build</h3>
                    <div className="list-group" style={{height: 400, overflow: "auto"}}>
                    {
                        this.state.builds.map(build => {
                            let date = new Date(build.date_added);
                            let formatted = date.toISOString();
                            return (
                                <a href="javascript: void(0)"
                                   onClick={this._onBuildSelect.bind(this, build.id)}
                                   className="list-group-item">
                                    {build.branch} - {formatted} - {build.version}
                                </a>
                            );
                        })
                    }
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <h3 className="text-center">Check changelog</h3>
                    {changelog}
                </div>
            </div>
        );
    }
}

export default SelectBuildAddon;
