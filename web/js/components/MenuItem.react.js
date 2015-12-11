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

    render() {
        var id = 'onoffswitch-' + this.props.item.id;
        var checked = this.state.checked;
        return (
            <li>
                <a href="#">
                    {this.props.item.name}
                    <div className="onoffswitch pull-right">
                        <input type="checkbox" name="onoffswitch"
                               className="onoffswitch-checkbox" id={id} checked={checked}
                               onChange={this.handleChange.bind(this)}/>
                        <label className="onoffswitch-label" htmlFor={id}/>
                    </div>
                </a>
            </li>
        );
    }
}

export default MenuItem;
