import React from 'react';

import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import SetOrder from './SetOrder.react';

class SetOrderWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.elemType = props.params.elemType;

        let store = null;
        if (this.elemType == 'environments') {
            store = EnvironmentStore;
        }
        else {
            store = ProjectStore;
        }

        this.state = {
            items: store.all,
            store: store
        };

        this._onChange = this._onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.params.elemType != nextProps.params.elemType) {
            this.elemType = nextProps.params.elemType;
            this._onChange();
        }
    }

    componentDidMount() {
        EnvironmentStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        EnvironmentStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
    }

    _onChange() {
        if (this.elemType == 'environments') {
            this.setState({
                items: EnvironmentStore.all,
                store: EnvironmentStore
            });
        }
        if (this.elemType == 'projects') {
            this.setState({
                items: ProjectStore.all,
                store: ProjectStore
            });
        }
    }

    render() {
        return <SetOrder items={this.state.items} store={this.state.store}/>
    }
}

export default SetOrderWrapper;
