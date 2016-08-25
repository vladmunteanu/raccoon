import React from 'react'
import { Link } from 'react-router';

import AppDispatcher from '../dispatcher/AppDispatcher';


class MenuItem extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.hasOwnProperty("store")) {
            this.state = {
                checked: this.props.store.getToggle(this.props.item.id)
            }
        } else {
            this.state = {
                checked: false
            };
        }
    }

    handleChange(event) {
        this.setState({checked: event.target.checked});

        AppDispatcher.dispatch({
            action: this.props.action,
            data: {
                id: this.props.item.id,
                visible: event.target.checked
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
            left: (position.width - 2) + 'px'
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
        var dropDown = this.props.actions.length > 0 ? (
            <ul className="dropdown-menu">
                {
                    this.props.actions.map((item) => {
                        return (
                            <li key={`menu-item-link-${item.id}`}>
                                <Link to={'/action/' + item.id}>
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })
                }
            </ul>
        ): '';

        // js is cool, but this makes it a bit hard to read
        var link = !!this.props.link ? (
            <Link to={this.props.link}
                  onMouseEnter={this.handleMouseEnter.bind(this)}
                  className="dropdown-toggle"
                  aria-haspopup="true"
                  aria-expanded="false"
            >
                {this.props.item.label || this.props.item.name}
                {rightSwitch}
            </Link>
        ) : (
            <a href="javascript: void(0);"
                  onMouseEnter={this.handleMouseEnter.bind(this)}
                  className="dropdown-toggle"
                  aria-haspopup="true"
                  aria-expanded="false"
            >
                {this.props.item.label || this.props.item.name}
                {rightSwitch}
            </a>
        );

        return (
            <li className="dropdown">
                {/* Add link */}
                {link}

                {/* Add dropdown menu */}
                {dropDown}
            </li>

        );
    }
}

MenuItem.defaultProps = {
    actions: []
};

export default MenuItem;
