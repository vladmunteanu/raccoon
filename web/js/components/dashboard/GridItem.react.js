import React from 'react'

import RaccoonApp from '../RaccoonApp.react';
import CardMenu from './CardMenu.react';

<<<<<<< HEAD
=======
import ActionStore from '../../stores/ActionStore';

>>>>>>> 63fabb44cf692daf526ac4e4ae0cbcbff88df2a9

function getLocalState() {
    let localState = {};
    return RaccoonApp.getState(localState);
}

let GridItem = React.createClass({
    getInitialState: function () {
        return getLocalState();
    },

    componentDidMount: function() {
        ActionStore.addListener(this._onChange);
    },

    componentWillUnmount: function() {
        ActionStore.removeListener(this._onChange);
    },

    _onChange: function() {
        let state = getLocalState();
        this.setState(state);
    },

<<<<<<< HEAD
    render() {
        //<CardMenu actions={this.state.actions} />
=======
    render: function () {
>>>>>>> 63fabb44cf692daf526ac4e4ae0cbcbff88df2a9
        return (
            <div className="box pull-left">
                <div className="header">
                    <div className="row">
                        <span className="version pull-left">{this.props.environment.name.toUpperCase()}</span>

                    </div>

                    <div className="dropdown">
                        <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            <h4 className="list-group-item-heading environment">
                                {this.props.project.name} — 3.5.9-1736
                                <span className="caret" />
                            </h4>
                            <h5 className="branch">OE-2015-deployment-flow</h5>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                            <li>
                                <a href="#">
                                    <h4 className="list-group-item-heading environment">3.5.8-1736</h4>
                                    <h5 className="branch">master</h5>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <h4 className="list-group-item-heading environment">3.5.7-1736</h4>
                                    <h5 className="branch">OE-3133-no-manifest-for-37</h5>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <h4 className="list-group-item-heading environment">3.4.9-1736</h4>
                                    <h5 className="branch">OE-2015-deployment-flow</h5>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <h4 className="list-group-item-heading environment">3.5.9-1736</h4>
                                    <h5 className="branch">master</h5>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <h4 className="list-group-item-heading environment">3.5.9-1736</h4>
                                    <h5 className="branch">master</h5>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <h4 className="list-group-item-heading environment">3.5.9-1736</h4>
                                    <h5 className="branch">master</h5>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="content">
                    <div>
                        <ul className="media-list">
                            <li className="media">
                                <div className="media-left">
                                    <img src="/static/assets/img/user.jpg" className="img-circle" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="Alexandru Mihai<br/>23-05-2015 2:00 PM" />
                                </div>
                                <div className="media-body">
                                    Fixed #25159 -- Removed brackets from class/function/method signature...
                                </div>
                            </li>
                            <li className="media">
                                <div className="media-left">
                                    <img src="/static/assets/img/user2.jpg" className="img-circle" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="John Doe<br/>23-05-2015 2:00 PM" />
                                </div>
                                <div className="media-body">
                                    Fixed #25142 -- Added PermissionRequiredMixin.has_permission() to all...
                                </div>
                            </li>
                            <li className="media">
                                <div className="media-left">
                                    <img src="/static/assets/img/user.jpg" className="img-circle" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="Rudy Andi<br/>23-05-2015 2:00 PM" />
                                </div>
                                <div className="media-body">
                                    Fixed typo in docs/ref/middleware.txt
                                </div>
                            </li>
                            <li className="media">
                                <div className="media-left">
                                    <img src="/static/assets/img/user3.jpg" className="img-circle" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="Adc Tzuji<br/>23-05-2015 2:00 PM" />
                                </div>
                                <div className="media-body">
                                    Simplified MANIFEST.in
                                </div>
                            </li>
                            <li className="media">
                                <div className="media-left">
                                    <img src="/static/assets/img/user2.jpg" className="img-circle" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="Truly Pic<br/>23-05-2015 2:00 PM" />
                                </div>
                                <div className="media-body">
                                    Converted tabs to spaces in topics/auth/default.txt
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="build-details">
                        <ul className="media-list">
                            <li className="media">
                                <div className="media-left">
                                    <img src="/static/assets/img/user.jpg" className="img-circle" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="Rudy Andi<br/>23-05-2015 2:00 PM" />
                                </div>
                                <div className="media-body">
                                    Fixed typo in docs/ref/middleware.txt
                                </div>
                            </li>
                            <li className="media">
                                <div className="media-left">
                                    <img src="/static/assets/img/user.jpg" className="img-circle" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="Alexandru Mihai<br/>23-05-2015 2:00 PM" />
                                </div>
                                <div className="media-body">
                                    Fixed #25159 -- Removed brackets from class/function/method signature...
                                </div>
                            </li>
                            <li className="media">
                                <div className="media-left">
                                    <img src="/static/assets/img/user3.jpg" className="img-circle" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="Adc Tzuji<br/>23-05-2015 2:00 PM" />
                                </div>
                                <div className="media-body">
                                    Simplified MANIFEST.in
                                </div>
                            </li>
                            <li className="media">
                                <div className="media-left">
                                    <img src="/static/assets/img/user2.jpg" className="img-circle" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="Truly Pic<br/>23-05-2015 2:00 PM" />
                                </div>
                                <div className="media-body">
                                    Converted tabs to spaces in topics/auth/default.txt
                                </div>
                            </li>
                            <li className="media">
                                <div className="media-left">
                                    <img src="/static/assets/img/user2.jpg" className="img-circle" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="John Doe<br/>23-05-2015 2:00 PM" />
                                </div>
                                <div className="media-body">
                                    Fixed #25142 -- Added PermissionRequiredMixin.has_permission() to all...
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer">
            <span className="time pull-right" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="23-05-2015 2:00 PM">
              <span className="fa fa-clock-o" /> 15m ago
            </span>
                    <button className="btn btn-xs btn-default pull-right btn-install">Install</button>
                </div>
            </div>
        );
    }
});

export default GridItem;
