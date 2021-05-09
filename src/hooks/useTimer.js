import { useEffect, useState } from 'react';

export default function useTimer(
    timerId = 'timer', initialTimer = 0, increment = 1
) {
    const [timer, setTimer] = useState(initialTimer);
    const [isRunning, setIsRunning] = useState(false);
    const [isBackground, setIsBackground] = useState(
        document.visibilityState !== 'visible'
    );
    const sessionStorage = window.sessionStorage;

    const play = () => setIsRunning(true);
    const pause = () => setIsRunning(false);

    useEffect(() => {
        if (isRunning && !isBackground) {
            const interval = setInterval(() => {
                setTimer((t) => t + increment);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRunning, isBackground]);

    useEffect(() => {
        const onVisibilityChange = () => {
            setIsBackground(
                document.visibilityState !== 'visible'
            );
        };
        window.addEventListener(
            'visibilitychange', onVisibilityChange
        );

        return () => window.removeEventListener(
            'visibilitychange', onVisibilityChange
        );
    }, []);

    useEffect(() => {
        if (isBackground) {
            sessionStorage.setItem(timerId, Date.now());
        } else if (isRunning) {
            const lastTimer = Number(sessionStorage.getItem(timerId));
            if (lastTimer && isRunning) {
                const ellapsed = Math.floor(
                    (Date.now() - lastTimer) / (1000 * increment)
                );
                setTimer(t => t + ellapsed);
            }
        }
    }, [isBackground]);

    return { play, pause, value: timer, isRunning, set: setTimer };
}
