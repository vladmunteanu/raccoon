import React from 'react';

let addonStore = null;

class AddonStore {

    constructor() {
        if (!addonStore) {
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
