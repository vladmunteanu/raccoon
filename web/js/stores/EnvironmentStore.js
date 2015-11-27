import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';

//var MyDispatcher = require('MyDispatcher');


var _environments;


var EnvironmentStore = React.createClass({
    mixins: [FluxStore],

    getAll: function () {
        return _environments;
    },

    __onDispatch: function (action) {
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


module.exports = new EnvironmentStore(AppDispatcher);
// module.exports = EnvironmentStore;