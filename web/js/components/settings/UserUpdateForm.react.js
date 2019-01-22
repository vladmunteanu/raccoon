/**
 * Created by mdanilescu on 15/01/2019.
 */
/**
 * Created by mdanilescu on 15/01/2019.
 */
import React from 'react';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

import UserStore from '../../stores/UserStore';
import RightStore from '../../stores/RightStore';
import { UserForm } from './UserForm.react.js';


function getLocalState(userId) {
    let localState = {
        rights: RightStore.all,
        user: {
            name: '',
            rights: [],
        }
    };

    if ( userId ) {
        localState.user = UserStore.getById(userId);
    }

    return localState;
}

class UserUpdateForm extends UserForm {
    constructor(props) {
        super(props);
        this.formName = 'Update User';
        this.state = getLocalState(this.props.params.id);
        this.onSubmit = this.onSubmit.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id != this.props.params.id) {
            this.props.clearValidations();
            let state = getLocalState(nextProps.params.id);
            this.setState(state);
        }
    }

    _onChange() {
        let state = getLocalState(this.props.params.id);
        this.setState(state);
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.validate((error) => {
            if (!error) {
                UserStore.updateById(this.state.user.id, {
                    name: this.state.user.name,
                    rights: this.state.user.rights
                });
            }
        });
    }

    _getDataForRender() {
        this.state.user = UserStore.getById(this.props.params.id);
        if(!this.state.user) {
            this.state.user = {
                name: '',
                rights: [],
            }
        }

        return this.state.user;
    }
}

export { UserUpdateForm };
export default validation(strategy)(UserUpdateForm);
