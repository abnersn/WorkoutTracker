
export default function serializeWorkout(id) {
    const workout = {
        id,
        isComplete: true,
        activeSetId: null,
        activeExerciseId: null
    };

    workout.date = new Date();
    workout.name = document.querySelector('.workout-name').textContent.trim();
    workout.duration = Number(
        document.querySelector('.workout-duration').dataset.value
    );
    workout.exercises = [];

    const $exercises = document.querySelectorAll('.exercise');
    for (const $exercise of $exercises) {
        const exercise = {};
        exercise.name = $exercise.querySelector(
            '.exercise-name'
        ).textContent.trim();
        exercise.id = $exercise.dataset.id;
        exercise.sets = [];

        const $sets = $exercise.querySelectorAll('.set-display');
        for (const $set of $sets) {
            const set = {};
            set.id = $set.dataset.id;
            set.time = Number(
                $set.querySelector('.time .value').dataset.value
            );
            set.reps = Number(
                $set.querySelector('.reps .value').dataset.value
            );
            set.weight = Number(
                $set.querySelector('.weight .value').dataset.value
            );
            set.rest = Number(
                $set.querySelector('.rest .value').dataset.value
            );
            set.stage = 'COMPLETE';
            exercise.sets.push(set);
        }
        exercise.rpe = Number($exercise.querySelector('.rpe').value);
        workout.exercises.push(exercise);
    }

    return JSON.stringify(workout);
}