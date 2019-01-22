/**
 * Created by mdanilescu on 15/01/2019.
 */
import React from 'react';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import Autocomplete from 'react-autocomplete';
import Select from 'react-select';

import UserStore from '../../stores/UserStore';
import RightStore from '../../stores/RightStore';
import FormValidationError from '../FormValidationError.react';


function getLocalState() {
    return {
        rights: RightStore.all,
        user: {
            name: '',
            rights: [],
        },
    };
}


class UserForm extends React.Component {
    constructor(props) {
        super(props);
        this.formName = 'New User';
        this.state = getLocalState();

        this.validatorTypes = {
            name: Joi.string().min(3).max(50).required().label('User name'),
            rights: Joi.any().disallow(null, '').required().label('Rights'),
        };
        this.getValidatorData = this.getValidatorData.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
        this._onChange = this._onChange.bind(this);
        this.addRight = this.addRight.bind(this);
    }

    componentDidMount() {
        UserStore.addListener(this._onChange);
        RightStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        UserStore.removeListener(this._onChange);
        RightStore.removeListener(this._onChange);
    }

    _onChange() {
        let state = getLocalState();
        state.user = this.state.user;
        this.setState(state);
    }

    onFormChange(name, event) {
        this.state.user[name] = event.target.value;
        this.setState(this.state);
        this.props.validate(name);
    }

    getValidatorData() {
        return this.state.user;
    }

    _getDataForRender() {
        return this.state.user;
    }

    addRight(event) {
        if (event) {
            this.state.user.rights = event.split(',');
        } else {
            this.state.user.rights = [];
        }
        this.setState(this.state);
    }

    onDelete() {
        UserStore.deleteByid(this.state.user.id);
        this.context.router.push('/settings/user/new');
    }

    render() {
        let user = this._getDataForRender();
        let name = user.name;
        let optionsRights = [];
        let rights = this.state.user.rights;

        for (let key in this.state.rights) {
            optionsRights.push({
                'value': this.state.rights[key].id,
                'label': this.state.rights[key].name
            })
        }


        return (
            <div className="container">
                <h3>{this.formName}</h3>
                <form onSubmit={this.onSubmit} className="form-horizontal col-sm-4">
                    <div className="form-group">
                        <label htmlFor="User-name" className="control-label">User name</label>
                        <input type="text"  className="form-control"
                               id="User-name" value={name} placeholder="User Name"
                               onChange={this.onFormChange.bind(this, 'name')}/>
                        <FormValidationError key="form-errors-name" messages={this.props.getValidationMessages('name')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="User-rights" className="control-label">Rights</label>
                        <Select id="select-multi" ref="selectRights"
                                value={rights}
                                options={optionsRights}
                                onChange={this.addRight}
                                multi={true}
                                joinValues={true}
                                delimiter=","
                                simpleValue={true}>
                        </Select>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Save" className="btn btn-info pull-user"/>
                    </div>
                </form>
            </div>
        );
    }
}

UserForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export { UserForm };
export default validation(strategy)(UserForm);
