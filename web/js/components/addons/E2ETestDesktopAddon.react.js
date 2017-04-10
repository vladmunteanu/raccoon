import React from 'react';

import BaseAddon from './BaseAddon.react';


class E2ETestDesktopAddon extends BaseAddon {
    constructor(props) {
        super(props);

        this.state = {
            project: this.addon_context.project,
            env: this.addon_context.environment.name,
            browser: "chrome",
            is_smoke: false,
            feature_list: ''
        };

        this.updateContext('env', this.state.env);
        this.updateContext('browser', this.state.browser);
        this.updateContext('is_smoke', this.state.is_smoke);
        this.updateContext('feature_list', this.state.feature_list);

        this._onChangeBrowser = this._onChangeBrowser.bind(this);
        this._onChangeSmoke = this._onChangeSmoke.bind(this);
        this._onChangeFeatureList = this._onChangeFeatureList.bind(this);
    }

    _onChangeBrowser(event) {
        this.setState({browser: event.target.value, });
        let t_value = event.target.value;
        let value = t_value.replace("00", "-00");
        this.updateContext('browser', value);
    }

    _onChangeSmoke(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({is_smoke: value});
        this.updateContext('is_smoke', value);
    }

    _onChangeFeatureList(event) {
        const value = event.target.value;
        this.setState({feature_list: value});
        this.updateContext('feature_list', value);
    }

    render() {
        let changelog = (<div>Select a browswer to run tests on.</div>);
        let browser_list = {
            chrome: "Chrome",
            firefox: "Firefox",
            ie11: "Internet explorer 11 (ie11.oe.avira.org)",
            chrome001: "Chrome 001 (chrome-001.oe.avira.org)",
            chrome002: "Chrome 002 (chrome-002.oe.avira.org)",
            firefox001: "Firefox 001 (firefox-001.oe.avira.org)",
            firefox002: "Firefox 002 (firefox-002.oe.avira.org)",
            edge001: "Edge 001 (edge-001.oe.avira.org)",
        };
        return (
            <div className="container-fluid">
                <div className="row form-group">
                    <div className="input-group col-lg-6 col-md-6 col-xs-6">
                        <label htmlFor="browser">Select your browser</label>
                        <select className="form-control" value={this.state.browser} id="browser" onChange={this._onChangeBrowser}>
                            <option key="" disabled>-- select a browser --</option>
                            {
                                Object.keys(browser_list).map(b_name => {
                                    return <option key={b_name} value={b_name}>{browser_list[b_name]}</option>;
                                })
                            }
                        </select>

                    </div>
                    <div>
                        <label>
                        <input name="smoke_tests" type="checkbox" checked={this.state.is_smoke} onChange={this._onChangeSmoke}/> Run smoke tests
                        </label>
                    </div>
                    <div>
                        <label>Feature list: <input name="feature_list" type="text" value={this.state.feature_list} onChange={this._onChangeFeatureList}/></label>
                    </div>
                </div>
            </div>
        )
    }
}

export default E2ETestDesktopAddon;