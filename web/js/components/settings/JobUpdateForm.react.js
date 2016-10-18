import React from 'react';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import JobStore from '../../stores/JobStore';
import JenkinsStore from '../../stores/JenkinsStore';
import ConnectorStore from '../../stores/ConnectorStore';
import { JobForm } from './JobForm.react.js';


function getLocalState(jobId) {
    let localState = {
        connectors: ConnectorStore.all,
        connectorTypes: ConnectorStore.types,
        jobs: JenkinsStore.jobs,
        job: JobStore.getById(jobId),
        rowCount: 0
    };
    if (localState.job) {
        let connector = ConnectorStore.getById(localState.job.connector);
        if (connector) {
            localState.job.store = localState.connectorTypes[connector.type].store;
            localState.job.jobValues = localState.job.store.jobValues();
        }
        let rowCount = 1;
        if (localState.job.arguments.length > 0) {
            rowCount = localState.job.arguments.length
        }
        localState.rowCount = rowCount;
    }
    return localState;
}

class JobUpdateForm extends JobForm {
    constructor(props) {
        super(props);
        this.formName = 'Update job';
        this.state = getLocalState(this.props.params.id);
        this.onSubmit = this.onSubmit.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id != this.props.params.id) {
            this.props.clearValidations();
            let state = getLocalState(nextProps.params.id);
            this.setState(state);
        }
    }

    _onChange() {
        let state = getLocalState(this.props.params.id);
        this.setState(state);
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                JobStore.updateById(this.state.job.id, {
                    name: this.state.job.name,
                    connector: this.state.job.connector,
                    action_type: this.state.job.action_type,
                    job: this.state.job.job,
                    arguments: this.state.job.arguments
                });
            }
        });
    }

    _getDataForRender() {
        this.state.job = JobStore.getById(this.props.params.id);
        if(!this.state.job) {
            this.state.job = {
                name: '',
                connector: '',
                action_type: '',
                job: '',
                arguments: [],
                jobValues: []
            }
        }
        return this.state.job;
    }
}

export { JobUpdateForm };
export default validation(strategy)(JobUpdateForm);
