import React from 'react';
import FluxStore from 'flux';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

import Connector from '../utils/Connector';


var ProjectStore =  assign(Connector, EventEmitter.prototype, {
    _projects: [],

    emitChange: function() {
        this.emit('change');
    },

    addListener: function(callback) {
        this.on('change', callback);
    },

    removeListener: function(callback) {
        this.removeListener('change', callback);
    },

    fetchAll: function () {
        var self = this;

        this.sendRequest({"verb": "get", "resource": "/api/v1/projects/"}, function (response) {
            console.log(response);
            self._projects = response.data;
            self.emitChange();

            return response.data;
        });
    },

    getAll: function () {
        return this._projects;
    },
});


module.exports = ProjectStore;