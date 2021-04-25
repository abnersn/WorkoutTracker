export default class Workout {
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
