import React from 'react';


class BaseAddon extends React.Component {
    constructor(props) {
        super(props);

        this.context = this.props.context || {};
    }

    getContext() {
        return this.context;
    }
}

export default BaseAddon;
