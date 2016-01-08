import React from 'react'

import AppDispatcher from '../dispatcher/AppDispatcher';


class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //checked: Math.random() >= 0.5
            checked: false,
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

    handleMouseEnter(event) {
        var position = event.target.getBoundingClientRect();
        var dropdownMenu = $(event.target).parent().find('.dropdown-menu');
        var top =
            position.top + dropdownMenu.height() <= $(document).height() ?
                position.top :
                position.top - dropdownMenu.height() + 25;

        dropdownMenu.css({
            top: top + 'px',
            left: position.width + 'px'
        });
    }

    render() {
        var id = 'onoffswitch-' + this.props.item.id;
        var checked = this.state.checked;
        var rightSwitch = !!this.props.switch ? (
            <div className="onoffswitch pull-right">
                <input type="checkbox" name="onoffswitch"
                       className="onoffswitch-checkbox" id={id} checked={checked}
                       onChange={this.handleChange.bind(this)} />
                <label className="onoffswitch-label" htmlFor={id}/>
            </div>
        ) : '';

        return (
            <li className="dropdown">
                <a href="javascript: void(0);"
                   onMouseEnter={this.handleMouseEnter.bind(this)}
                   className="dropdown-toggle"
                   aria-haspopup="true"
                   aria-expanded="false"
                >
                    {this.props.item.label || this.props.item.name}
                    {rightSwitch}
                </a>
                <ul className="dropdown-menu">
                    <li><a href="#">Action</a></li>
                    <li><a href="#">Another action</a></li>
                    <li><a href="#">Something else here</a></li>
                    <li role="separator" className="divider" />
                    <li><a href="#">Separated link</a></li>
                </ul>
            </li>
        );
    }
}

export default MenuItem;
