import React from 'react';


class BaseAddon extends React.Component {
    constructor(props) {
        super(props);

        this.addon_context = this.props.context || {};
    }

    updateContext(key, value) {
        this.addon_context[key] = value;
    }

    getContext() {
        return this.addon_context;
    }
}

export default BaseAddon;
