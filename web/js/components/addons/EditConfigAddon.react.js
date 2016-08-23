import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/yaml';

import 'brace/theme/github';
import 'brace/ext/searchbox';

import BaseAddon from './BaseAddon.react';
import SaltStore from '../../stores/SaltStore';
import ActionStore from '../../stores/ActionStore';
import FlowStore from '../../stores/FlowStore';
import JobStore from '../../stores/JobStore';
import InstallStore from '../../stores/InstallStore';
import ConnectorStore from '../../stores/ConnectorStore';
import BuildStore from '../../stores/BuildStore';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';


// Constants used to extract different config files from the config string
let DEFAULT_CONFIG_DELIMITER_START = "##START-DEFAULT-CONFIG##";
let DEFAULT_CONFIG_DELIMITER_END = "##END-DEFAULT-CONFIG##";
let LOCAL_CONFIG_DELIMITER_START = "##START-LOCAL-CONFIG##\n";
let LOCAL_CONFIG_DELIMITER_END = "##END-LOCAL-CONFIG##";


class EditConfigAddon extends BaseAddon {
    
    constructor(props) {
        super(props);

        this.state = {
            project: ProjectStore.getById(this.addon_context.project),
            environment: EnvironmentStore.getById(this.addon_context.environment),
            config: null,
            defaultConfig: null,
            localConfig: null,
            action: ActionStore.getById(this.addon_context.action),
            flow: null,
            job: null,
            install: null,
            build: null,
            branch: null,
            connectorId: null,
            saveInProgress: SaltStore.isSaveInProgress()
        };

        this._onChange = this._onChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleConfigChange = this.handleConfigChange.bind(this);

        if (!InstallStore.all) {
            InstallStore.fetchAll();
        }
    }

    /**
     * Updates the internal state when stores emit changes.
     * @private
     */
    _updateState() {
        let project = this.state.project ? this.state.project : ProjectStore.getById(this.addon_context.project);
        let environment = this.state.environment ? this.state.environment : EnvironmentStore.getById(this.addon_context.environment);
        let action = this.state.action ? this.state.action : ActionStore.getById(this.addon_context.action);

        let flow = this.state.flow;
        if (action && !flow) {
            flow = FlowStore.getById(action.flow);
        }

        let job = this.state.job;
        if (flow && !job) {
            job = JobStore.getById(flow.job);
        }

        let connectorId = this.state.connectorId;
        if (job && !connectorId) {
            connectorId = job.connector;
        }

        let install = this.state.install;
        if (project && environment && !install) {
            install = InstallStore.getLatestInstall(project, environment);
        }

        let build = this.state.build;
        if (install && !build) {
            build = BuildStore.getById(install.build);
        }

        let branch = this.state.branch;
        if (build && !branch && !this.state.config) {
            branch = build.branch;
            // get config since we have all the necessary parameters
            SaltStore.getConfig(
                connectorId,
                project,
                environment,
                branch
            );
        }

        if (connectorId && branch && !this.state.config) {
            this.state.config = SaltStore.config;
        }

        /* Extract default and local configuration files */
        let defaultConfig = this.state.defaultConfig;
        let localConfig = this.state.localConfig;
        if (this.state.config && !defaultConfig && !localConfig) {
            // get the default config string
            let startDefaultConfig = this.state.config.indexOf(DEFAULT_CONFIG_DELIMITER_START) + DEFAULT_CONFIG_DELIMITER_START.length;
            let endDefaultConfig = this.state.config.indexOf(DEFAULT_CONFIG_DELIMITER_END);
            defaultConfig = this.state.config.substr(
                startDefaultConfig,
                endDefaultConfig - startDefaultConfig
            );

            // get the local config string
            let startLocalConfig = this.state.config.indexOf(LOCAL_CONFIG_DELIMITER_START) + LOCAL_CONFIG_DELIMITER_START.length;
            let endLocalConfig = this.state.config.indexOf(LOCAL_CONFIG_DELIMITER_END);
            localConfig = this.state.config.substr(
                startLocalConfig,
                endLocalConfig - startLocalConfig
            );
        }

        this.setState({
            project: project,
            environment: environment,
            action: action,
            flow: flow,
            job: job,
            install: install,
            build: build,
            branch: branch,
            connectorId: connectorId,
            defaultConfig: defaultConfig,
            localConfig: localConfig,
            saveInProgress: SaltStore.isSaveInProgress()
        });
    }

    componentDidMount() {
        SaltStore.addListener(this._onChange);
        ActionStore.addListener(this._onChange);
        FlowStore.addListener(this._onChange);
        JobStore.addListener(this._onChange);
        ConnectorStore.addListener(this._onChange);
        InstallStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
        BuildStore.addListener(this._onChange);

        this._updateState();
    }

    componentWillUnmount() {
        SaltStore.removeListener(this._onChange);
        ActionStore.removeListener(this._onChange);
        FlowStore.removeListener(this._onChange);
        JobStore.removeListener(this._onChange);
        ConnectorStore.removeListener(this._onChange);
        InstallStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
        BuildStore.removeListener(this._onChange);
    }

    _onChange() {
        this._updateState();
    }

    /**
     * Saves the modified local config.
     */
    handleSave() {
        if (this.state.localConfig[this.state.localConfig.length - 1] != "\n") {
            this.state.localConfig = "\n";
        }
        SaltStore.setConfig(
            this.state.connectorId,
            this.state.project,
            this.state.environment,
            this.state.branch,
            this.state.localConfig
        );
    }

    /**
     * Updates the local config state each time a change is made.
     * @param newValue Current value of local config
     */
    handleConfigChange(newValue) {
        this.setState({localConfig: newValue});
    }

    render() {
        let title = "";
        if (this.state.project && this.state.environment) {
            title = "Configure " + this.state.project.label;
            title += " on " + this.state.environment.name.toUpperCase();
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-12">
                        <h3>{title}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <AceEditor
                            name="default-config"
                            theme="github"
                            mode="yaml"
                            fontSize={12}
                            enableBasicAutocompletion={true}
                            enableLiveAutocompletion={true}
                            width="100%"
                            minLines={20}
                            maxLines={50}
                            readOnly={true}
                            value={this.state.defaultConfig || ''}
                        />
                    </div>
                    <div className="col-xs-6">
                        <AceEditor
                            name="local-config"
                            theme="github"
                            mode="yaml"
                            fontSize={12}
                            enableBasicAutocompletion={true}
                            enableLiveAutocompletion={true}
                            width="100%"
                            minLines={20}
                            maxLines={50}
                            onChange={this.handleConfigChange}
                            value={this.state.localConfig || ''}
                        />
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-xs-6">
                        <button type="button" className={"btn btn-success" + (this.state.saveInProgress ? " disabled" : "")} aria-label="Save" onClick={this.handleSave}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditConfigAddon;
