import React from 'react'

import RaccoonApp from '../RaccoonApp.react';
import CardMenu from './CardMenu.react';

import ActionStore from '../../stores/ActionStore';
import BuildStore from '../../stores/BuildStore';
import InstallStore from '../../stores/InstallStore';


function getLocalState() {
    let localState = {
        builds: [],
        install: null,
        installedBuild: {
            version: '',
            branch: '',
            changelog: []
        }
    };
    return RaccoonApp.getState(localState);
}

let GridItem = React.createClass({
    getInitialState: function () {
        return getLocalState();
    },

    componentDidMount: function() {
        ActionStore.addListener(this._onChange);
        BuildStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActionStore.removeListener(this._onChange);
        BuildStore.removeListener(this._onChange);
    },

    _onChange: function() {
        let state = getLocalState();
        state.builds = BuildStore.filter(this.props.project);
        state.install = InstallStore.getLatestInstall(
            this.props.project,
            this.props.environment
        );
        if (state.install)
            state.installedBuild = BuildStore.getById(state.install.build);
        this.setState(state);
    },

    _onSelectBuild: function(id, event) {
        this.state.installedBuild = BuildStore.getById(id);
        this.setState(this.state);
    },

    render: function () {
        return (
            <div className="box pull-left">
                <div className="header">
                    <div className="row">
                        <span className="version pull-left">{this.props.environment.name.toUpperCase()}</span>
                        <CardMenu actions={ActionStore.filter(this.props.project,this.props.environment,"card")} />
                    </div>

                    <div className="dropdown">
                        <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            <h4 className="list-group-item-heading environment">
                                {this.props.project.name} — {this.state.installedBuild.version}-{this.props.project.build_nr}
                                <span className="caret" />
                            </h4>
                            <h5 className="branch">{this.state.installedBuild.branch}</h5>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                            {
                                this.state.builds.map(build => {
                                    return (
                                        <li onClick={this._onSelectBuild.bind(this, build.id)}>
                                            <a href="#">
                                                <h4 className="list-group-item-heading environment">
                                                    {build.version}
                                                </h4>
                                                <h5 className="branch">{build.branch}</h5>
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="content">
                    <div>
                        <ul className="media-list">
                            {
                                this.state.installedBuild.changelog.map(commit => {
                                    return (
                                        <li className="media">
                                            <div className="media-left">
                                                <img src="/static/assets/img/user.jpg" className="img-circle" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="Alexandru Mihai<br/>23-05-2015 2:00 PM" />
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
                </div>
                <div className="footer">
                    <span className="time pull-right" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="23-05-2015 2:00 PM">
                    <span className="fa fa-clock-o" /> 15m ago</span>
                    <button className="btn btn-xs btn-default pull-right btn-install">Install</button>
                </div>
            </div>
        );
    }
});

export default GridItem;
