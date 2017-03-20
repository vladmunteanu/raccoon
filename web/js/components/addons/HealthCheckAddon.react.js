import React from 'react';

import BaseAddon from './BaseAddon.react';

class HealthCheckAddon extends BaseAddon {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'fail-only',
        };

        this.updateContext('mode', this.state.mode);
        this.updateContext('project_id', this.addon_context.project.id);
        this.onModeChanged = this.onModeChanged.bind(this);
    }

    onModeChanged(event) {
        this.setState({mode: event.target.value});
        this.updateContext('mode', event.target.value);
    }

    render() {
        return (
            <div>
                <label htmlFor="mode" className="control-label">Mode</label>
                <input type="text"  className="form-control"
                       id="mode" value={this.state.mode} placeholder="Mode"
                       onChange={this.onModeChanged}/>
            </div>
        );
    }
}

export default HealthCheckAddon;
