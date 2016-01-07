import keyMirror from 'keymirror';


export default {
    ActionTypes: keyMirror({
        // auth
        LOGIN_USER: null,
        REGISTER_USER: null,

        // projects
        PROJECT_TOGGLE_VISIBLE: null,

        // environments
        ENVIRONMENT_TOGGLE_VISIBLE: null,

        // actions
        ACTION_TOGGLE_VISIBLE: null,

        // connectors
        CONNECTOR_TOGGLE_VISIBLE: null,

        // users
        USER_TOGGLE_VISIBLE: null,

        // rights
        RIGHT_TOGGLE_VISIBLE: null,
    })
};
