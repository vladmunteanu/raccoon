import Dispatcher from 'flux';

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
    }

    handleViewAction (action) {
        this.dispatcher.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });
    }
}

export default AppDispatcher;

