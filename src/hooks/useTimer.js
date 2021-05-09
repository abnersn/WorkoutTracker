import { useEffect, useState } from 'react';

export default function useTimer(initialTimer = 0) {
    const [timer, setTimer] = useState(initialTimer);
    const [isRunning, setIsRunning] = useState(false);
    const [isBackground, setIsBackground] = useState(
        document.visibilityState !== 'visible'
    );
    const localStorage = window.localStorage;

    const play = () => setIsRunning(true);
    const pause = () => setIsRunning(false);

    useEffect(() => {
        if (isRunning && !isBackground) {
            const interval = setInterval(() => {
                setTimer((t) => t + 1);
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
            localStorage.setItem('lastTimer', Date.now());
        } else if (isRunning) {
            const lastTimer = Number(localStorage.getItem('lastTimer'));
            if (lastTimer && isRunning) {
                const ellapsed = Math.floor((Date.now() - lastTimer) / 1000);
                setTimer(t => t + ellapsed);
            }
        }
    }, [isBackground]);

    return { play, pause, value: timer, isRunning };
}
