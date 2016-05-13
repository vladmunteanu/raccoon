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

    register(addonName, addonClass) {
        this.addons[addonName] = addonClass;
    }

    getAddon(addonName) {
        return this.addons[addonName];
    }

    get all() {
        return Object.keys(this.addons);
    }

    set all(addons) {}
}

export default new AddonStore();