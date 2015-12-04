import React from 'react'


class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checked: Math.random() >= 0.5}
    }

    handleChange(event) {
        this.setState({checked: event.target.checked});
        console.log(event.target.checked)
    }

    render() {
        var id = 'onoffswitch-' + this.props.id;
        var checked = this.state.checked;
        return (
            <li>
                <a href="#">
                    {this.props.title}
                    <div className="onoffswitch pull-right">
                        <input type="checkbox" name="onoffswitch"
                               className="onoffswitch-checkbox" id={id} checked={checked}
                               onChange={this.handleChange.bind(this)} />
                        <label className="onoffswitch-label" htmlFor={id} />
                    </div>
                </a>
            </li>
        );
    }
}

export default MenuItem;
