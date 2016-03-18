/**
 * Created by mdanilescu on 18/03/16.
 */
import React from 'react';

class BaseAddon extends React.Component {
    constructor(props) {
        super(props);

        this.context = this.props.context;
    }

}

export default BaseAddon;