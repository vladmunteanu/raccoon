import React from 'react';

import NotificationStore from '../stores/NotificationStore';


var Notification = React.createClass({

    getInitialState: function () {
        return {
            notifications: NotificationStore.all,
        };
    },

    componentDidMount: function () {
        NotificationStore.addListener(this._onChange);
    },

    componentWillUnmount: function () {
        NotificationStore.removeListener(this._onChange);
        NotificationStore.clear();
    },

    _onChange: function () {
        this.setState({
            notifications: NotificationStore.all,
        });
    },

    render: function () {
        let visible = true;
        this.state.notifications.map((notification) => {
            if (!!notification.showed) {
                visible = false;
            }
        });

        return (
            <div className={'notifications-container ' + (visible ? '' : 'hidden')}>
                {
                    this.state.notifications.map((notification) => {
                        return <NotificationItem key={notification.requestId} data={notification}/>;
                    })
                }
            </div>
        );
    }

});

var NotificationItem = React.createClass({

    getType: function (data) {
        if (data.code >= 500) return ['danger', 'Oh snap'];
        else if (data.code >= 300) return ['warning', 'Warning'];
        else if (data.code >= 200) return ['success', 'Well done'];
        return ['info', 'Heads up'];
    },

    getMessage: function (data) {
        if (data.code >= 500) return 'Something is broken. The team will investigate this error.';
        else if (data.code >= 300) return 'The request was invalid or cannot be otherwise served';
        else if (data.code >= 200) {
            let r = data.resource.match(/\/api\/v1\/(.*)\/(.*)/);
            let model = r[1], id = r[2];
            let verb = data.verb.toUpperCase();

            if (verb == 'PUT') return 'Your ' + model + ' were updated.';
            else if (verb == 'POST') return 'Your ' + model + ' were created.';

        }

        return '';
    },

    render: function () {
        let data = this.props.data;
        let alert_type = this.getType(data);
        let alert_message = this.getMessage(data);

        return (
            <div className={"alert alert-dismissible alert-expire alert-" + alert_type[0]} role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <strong>{alert_type[1]}!</strong> {alert_message}
            </div>
        );
    }
});

export default Notification;
