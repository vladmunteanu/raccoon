/**
 * Created by mdanilescu on 18/03/16.
 */
import React from 'react';
import BaseAddon from './BaseAddon.react';


class DummyAddon extends BaseAddon {
    constructor(props) {
        super(props);

    }

    render() {
        console.log(this);
        return (
            <p>
                This is an Add-On.
            </p>
        );
    }
}

export default DummyAddon;