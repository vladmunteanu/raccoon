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
    })
};
