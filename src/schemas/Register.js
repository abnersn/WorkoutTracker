export class WorkoutLog {
    constructor() {
        this.startTime = Date.now();
        this.endTime = null;
    }
    get duration() {
        if (Number.isFinite(this.endTime)) {
            return null;
        }
        return Math.floor(this.endTime - this.startTime);
    }
    setEndTime(dateMs) {
        this.endTime = dateMs;
    }
}

export default class Register {
    constructor() {
        this.logs = new Map();
    }
    addLog(workoutId) {
        this.logs.set(workoutId, new WorkoutLog());
    }
    completeLog(workoutId) {
        const log = this.logs.get(workoutId);
        if (!log) {
            console.warn(`Log not found for workout ${workoutId}`);
            return;
        }
        log.setEndTime(Date.now());
    }
}