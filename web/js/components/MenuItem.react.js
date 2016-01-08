import React from 'react'

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionStore from '../stores/ActionStore';


class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //checked: Math.random() >= 0.5
            checked: false,
            actions: ActionStore.all
        }
    }

    handleChange(event) {
        this.setState({checked: event.target.checked});
        AppDispatcher.dispatch({
            action: this.props.action,
            data: {
                id: this.props.item.id,
                visible: event.target.checked,
            }
        });
    }

    render() {
        var id = 'onoffswitch-' + this.props.item.id;
        var checked = this.state.checked;
        var rightSwitch = !!this.props.switch ? (
            <div className="onoffswitch pull-right">
                <input type="checkbox" name="onoffswitch"
                       className="onoffswitch-checkbox" id={id} checked={checked}
                       onChange={this.handleChange.bind(this)}/>
                <label className="onoffswitch-label" htmlFor={id}/>
            </div>
        ) : '';

        return (
            <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                    {this.props.item.name}
                    {rightSwitch}
                </a>
                <ul className="dropdown-menu dropdown-menu-right">
                    {this.state.actions.map(function(item) {
                        return <li><a href="#">{item}</a></li>
                    })}
                </ul>
            </li>

        );
    }
}

export default MenuItem;
