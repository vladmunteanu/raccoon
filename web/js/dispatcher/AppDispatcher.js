import React from 'react';
import Dispatcher from 'flux';
import assign from 'object-assign';


var AppDispatcher = React.createClass({

  mixins: [Dispatcher],

  /**
   * A bridge function between the views and the dispatcher, marking the action
   * as a view action.  Another variant here could be handleServerAction.
   * @param  {object} action The data coming from the view.
   */
  handleViewAction: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },

  render: function () {
    
  }

});

export default AppDispatcher;

//module.exports = AppDispatcher;
