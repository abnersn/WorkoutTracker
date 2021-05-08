import { useEffect, useState } from 'react';

export default function useNotification() {
    const [hasAskedPermission, setHasAskedPermission] = useState(false);
    const [
        hasNotificationPermission,
        setHasNotificationPermission
    ] = useState(false);

    if (!('Notification' in window)) {
        return {
            hasAskedPermission,
            notify: () => {},
            hasNotificationPermission,
            requestNotificationPermission: () => {}
        };
    }

    useEffect(() => {
        setHasNotificationPermission(Notification.permission === 'granted');
        setHasAskedPermission(Notification.permission !== 'default');
    }, []);

    async function requestNotificationPermission() {
        const permission = await Notification.requestPermission();
        setHasNotificationPermission(permission === 'granted');
        setHasAskedPermission(true);
    }

    function notify(msg) {
        new Notification('Workout tracker', {
            body: msg,
            vibrate: true
        });
    }

    return {
        hasAskedPermission,
        notify,
        hasNotificationPermission,
        requestNotificationPermission
    };
}