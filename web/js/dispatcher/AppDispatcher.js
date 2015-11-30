import { Dispatcher } from 'flux';

let appDispatcher = null;


class AppDispatcher {
    constructor () {
        // make it singleton
        if (!appDispatcher) {
            appDispatcher = this;
        } else {
            return appDispatcher;
        }

        this.dispatcher = new Dispatcher();
        return this.dispatcher;
    }
}

export default new AppDispatcher();

