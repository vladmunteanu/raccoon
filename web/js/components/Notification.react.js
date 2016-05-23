import React from 'react';

import NotificationStore from '../stores/NotificationStore';


class Notification extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notifications: NotificationStore.all,
        };
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        NotificationStore.addListener(this._onChange);
    }

    componentWillUnmount() {
        NotificationStore.removeListener(this._onChange);
        NotificationStore.clear();
    }

    _onChange() {
        this.setState({
            notifications: NotificationStore.all,
        });
    }

    render() {
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

}

class NotificationItem extends React.Component {

    getType(data) {
        if (data.code >= 500) return ['danger', 'Oh snap'];
        else if (data.code >= 300) return ['warning', 'Warning'];
        else if (data.code >= 200) return ['success', 'Well done'];
        return ['info', 'Heads up'];
    }

    getMessage(data) {
        if (data.code >= 500) return 'Something is broken. The team will investigate this error.';
        else if (data.code >= 300) return 'The request was invalid or cannot be otherwise served';
        else if (data.code >= 200) {
            let r = data.resource.match(/\/api\/v1\/([\w-]+)[\/]?([\w-]+)?/);
            let model = r[1], id = r[2];
            let verb = data.verb.toUpperCase();

            if (verb == 'PUT') return 'Your ' + model + ' were updated.';
            else if (verb == 'POST') return 'Your ' + model + ' were created.';

        }

        return '';
    }

    render() {
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
}

export default Notification;
