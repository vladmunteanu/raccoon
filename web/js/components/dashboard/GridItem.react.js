import React from 'react'
import TimeAgo from 'react-timeago'

import CardMenu from './CardMenu.react';
import Utils from '../../utils/Utils';

import ActionStore from '../../stores/ActionStore';
import BuildStore from '../../stores/BuildStore';
import InstallStore from '../../stores/InstallStore';


class GridItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            install: null,
            installedBuild: null,
            noInstalledBuild: false
        };

        this._onInstallChange = this._onInstallChange.bind(this);
        this._onBuildChange = this._onBuildChange.bind(this);
    }

    componentWillMount() {
        InstallStore.addListener(this._onInstallChange);
        BuildStore.addListener(this._onBuildChange);

        InstallStore.fetchInstalls(this.props.project, this.props.environment)
    }

    componentWillUnmount() {
        InstallStore.removeListener(this._onInstallChange);
        BuildStore.removeListener(this._onBuildChange);
    }

    _onInstallChange() {
        let install = InstallStore.getLatestInstall(
            this.props.project, this.props.environment
        );
        if ((install && !this.state.install) || (install && this.state.install && install.id != this.state.install.id)) {
            this.setState({
                install: install,
                installedBuild: null,
                noInstalledBuild: false
            }, () => {
                BuildStore.fetchById(install.build);
            });
        }
        else {
            this.setState({
                noInstalledBuild: true
            })
        }
    }

    _onBuildChange() {
        if (this.state.install) {
            let build = BuildStore.getById(this.state.install.build);
            if (build) {
                this.setState({
                    installedBuild: build
                });
            }
        }
    }
    
    render() {
        let installedBuild = null;
        if (this.state.installedBuild)
            installedBuild = this.state.installedBuild;

        let content = (<h5 className="text-center">Loading...</h5>);
        if (this.state.noInstalledBuild) {
            content = (<h5 className="text-center">No build installed yet</h5>);
        }
        if (this.state.installedBuild) {
            content = (
                <div className="dropdown">
                    {installedBuild.version}
                    <small className="pull-right">
                        <TimeAgo
                            date={this.state.install.date_added * 1000}
                            minPeriod={60}
                            formatter={Utils.timeAgoFormatter}
                        />
                    </small>
                    <br />
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {installedBuild.branch}
                    </a>
                    <ul className="dropdown-menu">
                        <li className="dropdown-header">Changelog</li>
                        {
                            installedBuild.changelog.slice(0, 10).map((commit, i) => {
                                return (
                                    <li className="dropdown-item" key={"commit-" + i} style={{marginLeft: '3px'}}>
                                        <span>
                                            <b>{commit.author.name}</b>
                                            {" - "}
                                            <small>
                                                <TimeAgo
                                                    date={(new Date(commit.date)).getTime()}
                                                    minPeriod={60}
                                                    formatter={Utils.timeAgoFormatter}
                                                />
                                            </small>
                                            {" - " + commit.message}
                                        </span>

                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            );
        }

        let cardActions = ActionStore.filter(this.props.project, this.props.environment, "card");
        return (
            <div className="box pull-left">
                <div className="header">
                    <div className="row">
                        <span className="version pull-left">{this.props.environment.name.toUpperCase()}</span>
                        <span className="version pull-left">&nbsp;&nbsp;{this.props.project.label}</span>
                        <CardMenu project={this.props.project.id}
                                  environment={this.props.environment.id}
                                  actions={cardActions} />
                    </div>
                </div>
                <div className="content">
                    {content}
                </div>
            </div>
        );
    }
}

export default GridItem;
