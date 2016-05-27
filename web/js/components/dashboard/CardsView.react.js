import React from 'react';

import RaccoonApp from '../RaccoonApp.react';
import ProjectStore from '../../stores/ProjectStore';
import EnvironmentStore from '../../stores/EnvironmentStore';
import AuthStore from '../../stores/AuthStore';
import ActionStore from '../../stores/ActionStore';

import Sidebar from './Sidebar.react';
import Topbar from './../Topbar.react';
import Taskbar from './../Taskbar.react';
import GridItem from './GridItem.react';
import Notification from '../Notification.react';


class CardsView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = RaccoonApp.getState();
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        AuthStore.addListener(this._onChange);
        ActionStore.addListener(this._onChange);
        ProjectStore.addListener(this._onChange);
        EnvironmentStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        AuthStore.removeListener(this._onChange);
        ActionStore.removeListener(this._onChange);
        ProjectStore.removeListener(this._onChange);
        EnvironmentStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = RaccoonApp.getState();
        this.setState(state);
    }

    render() {
        return (
            <div>
                {
                    this.state.projects.map(project => {
                        if (project.visible) {
                            return (
                                <div key={`section-${project.id}`} className="container-fluid grid-list">
                                    {
                                        this.state.environments.map(environment => {
                                            if (environment.visible) {
                                                return <GridItem
                                                    key={`card-${project.id}-${environment.id}`}
                                                    project={project}
                                                    environment={environment}/>;
                                            }
                                        })
                                    }
                                </div>
                            );
                        }
                    })
                }
            </div>
        );
    }
}

export default CardsView;
