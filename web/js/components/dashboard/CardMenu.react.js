import React from 'react';
import { Link } from 'react-router';

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
                            return <li>
                                <Link to={`/action/${action.id}/card/${this.props.project}/${this.props.environment}`}>
                                    {action.label}
                                </Link>
                            </li>
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default CardMenu;
