/**
 * Created by mdanilescu on 18/03/16.
 */
import React from 'react';
import BaseStore from './BaseStore';

let addonStore = null;

class AddonStore {

    constructor() {
        if (!addonStore) {
            //super();
            addonStore = this;
        } else {
            return addonStore;
        }

        this.addons = {};

    }

    register(addon_name, addon_class) {
        this.addons[addon_name] = addon_class;
    }

    getAddon(addon_name) {
        return this.addons[addon_name];
    }

    get all() {
        return Object.keys(this.addons);
    }

    set all(addons) {}
}

export default new AddonStore();