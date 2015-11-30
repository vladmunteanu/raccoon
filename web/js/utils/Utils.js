'use strict';


class Utils {

    /**
     * Generates a unique string based on timestamp and random number
     * @returns unique string
    */
    static uuid() {
        return (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    }
}

export default Utils;
