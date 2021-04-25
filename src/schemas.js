export class ExerciseSet {
    constructor(options) {
        const {
            reps = 8, weight = null, duration = 30, rest = 120, rpe = 8
        } = options;

        this.id =crypto.getRandomValues(new Uint32Array(1))[0].toString(16);

        this.reps = reps;
        this.weight = weight;
        this.duration = duration;
        this.rest = rest;
        this.rpe = rpe;
    }
}

export class Exercise {
    constructor(options) {
        const {
            name = '', targetReps = 0, targetWeight = null, targetDuration = 0,
            targetRest = 0, targetRPE = 0
        } = options;

        this.id =crypto.getRandomValues(new Uint32Array(1))[0].toString(16);

        this.name = name;
        this.targetProps = {
            reps: targetReps,
            weight: targetWeight,
            duration: targetDuration,
            rest: targetRest,
            rpe: targetRPE
        }

        this.sets = [];
    }

    addSet() {
        const set = new ExerciseSet(this.targetProps);
        this.sets = this.sets.push(set);
    }

    removeSet(id) {
        this.sets = this.sets.filter(r => r.id !== id);
    }
}

export class Workout {
    constructor({ name = '', duration = 0 }) {
        this.id =crypto.getRandomValues(new Uint32Array(1))[0].toString(16);

        this.exercises = [];
        this.name = name;
        this.duration = duration;
    }

    addExercise(name = '') {
        const exercise = new Exercise({ name });
        this.exercises = this.exercises.push(exercise);
    }

    removeExercise(id) {
        this.exercises = this.exercises.filter(e => e.id !== id);
    }
}

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

export class Register {
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