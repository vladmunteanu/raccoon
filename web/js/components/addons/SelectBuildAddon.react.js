import React from 'react';
import BaseAddon from './BaseAddon.react';
import BuildStore from '../../stores/BuildStore';


class SelectBuildAddon extends BaseAddon {
    constructor(props) {
        super(props);
        console.log(props);
        //this.state = {
        //    builds: BuildStore.filter(project),
        //}
    }

    componentDidMount() {
        BuildStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        BuildStore.removeListener(this._onChange);
    }

    _onChange() {}

    render() {
        return (
            <p>
                This is an Add-On. {this.props.name}
            </p>
        );
    }
}

export default SelectBuildAddon;
