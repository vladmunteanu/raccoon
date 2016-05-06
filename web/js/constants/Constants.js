import keyMirror from 'keymirror';


export default {
    ActionTypes: keyMirror({
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

        //jobs
        JOB_TOGGLE_VISIBLE: null,

        //notifications
        NOTIFICATION: null,

        // Actions
        BUILD_START: null,
        BUILD_STOP: null,
        BUILD_INFO: null,
        BUILD_OUTPUT: null,
    })
};
