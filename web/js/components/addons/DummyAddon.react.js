import React from 'react';
import BaseAddon from './BaseAddon.react';


class DummyAddon extends BaseAddon {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <p>
                This is an Add-On. {this.props.name}
            </p>
        );
    }
}

export default DummyAddon;