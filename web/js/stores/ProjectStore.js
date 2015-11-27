import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import { WS_URL } from '../config/Config';


var _projects = ['Applogic', 'MYA'];


var ProjectStore =  assign(EventEmitter.prototype, {
    //mixins: [FluxStore],

    emitChange: function() {
        this.emit('PULA_CHANGED');
    },

    getInitialState: function () {
        console.log(WS_URL);
        
        var ws = new WebSocket(WS_URL);
        ws.onopen = this._onOpen;
        ws.onmessage = this._onMessage;

        return {
            'ws': ws
        }
    },

    _onOpen: function () {
        this.state.ws.send('{"verb": "get", "resource": "/api/v1/projects/"}')
    },

    _onMessage: function (event) {
        var data = JSON.parse(event.data);
        this._projects = data;

        console.log(['message', data, this]);
    },

    _onError: function () {
        console.log('error');
    },

    _onClose: function () {
        console.log('close');
    },

    getAll: function () {
        return _projects;
    },

    __onDispatch: function (action) {
        console.log('********************');
      switch(action.type) {
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

    render: function () {

    }

});


// module.exports = new ProjectStore(AppDispatcher);
// module.exports = ProjectStore;