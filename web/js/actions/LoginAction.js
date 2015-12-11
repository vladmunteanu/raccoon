import Constants from '../constants/Constants';
let ActionTypes = Constants.ActionTypes;


export default {
    login: (token) => {
        // Go to the Home page once the user is logged in
        history.pushState(null, '/');

        // We save the JWT in localStorage to keep the user authenticated. We’ll learn more about this later.
        localStorage.setItem('token', token);

        // Send the action to all stores through the Dispatcher
        //AppDispatcher.dispatch({
        //    action: ActionTypes.LOGIN_USER,
        //    token: token,
        //});
    }
}