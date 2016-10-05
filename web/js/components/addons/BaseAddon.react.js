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
     * @param callback: method to call after validation.
     *                  The callback function should take two arguments:
     *                      - validation errors object
     *                      - displayError bool: enables error notifications
     */
    validate(callback) {
        callback(null, false);
    }
}

export default BaseAddon;
