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

    /**
     * Method that validates the requirements of an addon.
     * Called by Flow, before going to the next step.
     *
     * Implement this in your addon if you need validation,
     * and return the error string if the validation fails.

     * @returns {null}
     */
    validate() {
        return null;
    }
}

export default BaseAddon;
