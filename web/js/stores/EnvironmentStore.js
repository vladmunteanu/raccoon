import React from 'react';
import FluxStore from 'flux';
//import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

//var MyDispatcher = require('MyDispatcher');

var EnvironmentStore = assign(EventEmitter.prototype, {
   // mixins: [FluxStore],

    _environments: [],

    emitChange: function() {
        this.emit('change');
    },

    addListener: function(callback) {
        this.on('change', callback);
    },

    removeListener: function(callback) {
        this.removeListener('change', callback);
    },

    getAll: function () {
        return this._environments;
    },

    __onDispatch: function (action) {
        console.log(action);
        switch (action.type) {
            case 'an-action':
                changeState(action.someData);
                this.__emitChange();
                break;
            case 'another-action':
                changeStateAnotherWay(action.otherData);
                this.__emitChange();
                break;
            default:
            // no op
        }
    },

});

export default EnvironmentStore;