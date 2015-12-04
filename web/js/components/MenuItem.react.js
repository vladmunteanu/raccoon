import React from 'react'


class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //checked: Math.random() >= 0.5
            checked: false,
        }
    }

    handleChange(event) {
        console.log(event.target.checked);

        this.setState({checked: event.target.checked});
        this.props.store.toggleVisible(this.props.item.id);
    }

    render() {
        console.log([this.props.item.name, this.props]);
        var id = 'onoffswitch-' + this.props.item.id;
        var checked = this.state.checked;
        return (
            <li>
                <a href="#">
                    {this.props.item.name}
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
