export class ExerciseLog {
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

export class WorkoutLog {
    constructor() {
        this.logs = [];
    }
    get duration() {
        const startTime = this.logs[0].startTime;
        const endTime = this.logs[this.logs.length - 1].endTime;
        return Math.floor(endTime - startTime);
    }
}

export default class Register {
    constructor() {
        this.logs = new Map();
    }
    addLog(workoutId) {
        this.logs.set(workoutId, new WorkoutLog());
    }
}