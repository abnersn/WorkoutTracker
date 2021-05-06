import serializeWorkout from '../util/serializeWorkout';

export function addWorkoutToList(workout) {
    const { localStorage } = window;

    if (!localStorage) {
        return;
    }

    const json = localStorage.getItem('workouts');
    const workouts = json ? JSON.parse(json) : [];
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
}

export function removeWorkoutFromList(id) {
    const { localStorage } = window;

    if (!localStorage) {
        return;
    }

    const json = localStorage.getItem('workouts');
    const workouts = json ? JSON.parse(json) : [];
    localStorage.setItem('workouts', JSON.stringify(
        workouts.filter(w => w.id !== id)
    ));
}

export function loadWorkout(logKey) {
    const { localStorage } = window;

    if (!localStorage) {
        return;
    }

    const json = localStorage.getItem(logKey);

    if (!json) {
        return null;
    }

    const workout = JSON.parse(json);
    workout.date = new Date(workout.date);

    return workout;
}

export function eraseWorkout(id) {
    const { localStorage } = window;

    if (!localStorage) {
        return;
    }
    const logKey = `${(new Date()).toISOString().split('T')[0]}_${id}`;
    localStorage.removeItem(logKey);
}

export function saveWorkout(id) {
    const { localStorage } = window;

    if (!localStorage) {
        return;
    }
    const logKey = `${(new Date()).toISOString().split('T')[0]}_${id}`;

    const json = serializeWorkout(id);

    localStorage.setItem(logKey, json);
}