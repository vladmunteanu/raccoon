import { Dispatcher } from 'flux';

let appDispatcher = null;


class AppDispatcher extends Dispatcher {
    constructor () {
        // make it singleton
        if (!appDispatcher) {
            super();
            appDispatcher = this;
        } else {
            return appDispatcher;
        }

        this.registeredCallbacks = [];

       // this.dispatcher = new Dispatcher();
        //return this.dispatcher;
    }

    registerOnce(action, callback) {

        if (this.registeredCallbacks.indexOf(action) == -1) {
            this.registeredCallbacks.push(action);

            return this.register(function (payload) {
                if (payload.action === action) {
                    callback(payload);
                }
            });
        }
    }
}

export default new AppDispatcher();
