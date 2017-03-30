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

        // tasks
        TASKBAR_TOGGLE: null,
        TASKBAR_SHOW: null,
        TASKBAR_HIDE: null
    }),
    TASK_READY_STATES: new Set(['FAILURE', 'SUCCESS']),
    TASK_UNREADY_STATES: new Set(['PENDING', 'STARTED'])
};
