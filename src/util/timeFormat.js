export default function timeFormat(seconds) {
    if (seconds < 0) {
        return `-${timeFormat(Math.abs(seconds))}`;
    }
    const pad = (val) => `${val % 60}`.padStart(2, '0');
    const minutes = Math.floor(seconds / 60);
    if (minutes === 0) {
        return `${seconds}`;
    }
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${minutes}:${pad(seconds)}`;
}