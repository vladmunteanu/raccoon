import React from 'react';

class CardMenu extends React.Component {
    render() {
        return (
            <div className="btn-group btn-settings pull-right">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="fa fa-edit" />
                </a>
                <ul className="dropdown-menu">
                    {
                        this.props.actions.map(action => {
                            return <li><a href={"action/" + action._id}>{action.label}</a></li>
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default CardMenu;
