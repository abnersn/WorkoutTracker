export class ExerciseSet {
    constructor(options) {
        const {
            reps = 8, weight = null, duration = 30, rest = 120
        } = options;

        this.id =crypto.getRandomValues(new Uint32Array(1))[0].toString(16);

        this.reps = reps;
        this.weight = weight;
        this.duration = duration;
        this.rest = rest;
    }
}

export default class Exercise{
    constructor(options) {
        const {
            name = '', targetReps = 0, targetWeight = null, targetDuration = 0,
            targetRest = 0, rpe = 8
        } = options;

        this.id =crypto.getRandomValues(new Uint32Array(1))[0].toString(16);

        this.name = name;
        this.targetProps = {
            reps: targetReps,
            weight: targetWeight,
            duration: targetDuration,
            rest: targetRest
        }
        this.rpe = rpe;

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