import React from 'react';

import BaseAddon from './BaseAddon.react';

class DesktopUrlsAddon extends BaseAddon {
    constructor(props) {
        super(props);
    }

    validate(callback) {
        callback({'Dummy addon': 'This addon does not trigger a job'}, true);
    }

    render() {
        return (
            <div>
                <a href="http://oegui2-desktop-reports.dev.oe.avira.org/" target="_blank"> Profiling </a><br />
                <a href="http://oegui2-desktop-coverage.dev.oe.avira.org/" target="_blank"> Unit Coverage </a><br/>
                <a href="http://oegui2-desktop-docs.dev.oe.avira.org/#/api" target="_blank"> Docs </a>
            </div>
        );
    }
}

export default DesktopUrlsAddon;