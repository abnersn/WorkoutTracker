import serializeWorkout from '../util/serializeWorkout';

export function workoutHistoryList() {
    const { localStorage } = window;

    const list = [];
    for (const key of Object.keys(localStorage)) {
        const [date, id] = key.split('_');
        if (!Date.parse(date) || !id) {
            continue;
        }
        const workout = JSON.parse(localStorage.getItem(key));
        workout.persistenceKey = key;
        list.push(workout);
    }

    return list;
}

export function getWorkoutList() {
    const { localStorage } = window;

    const json = localStorage.getItem('workouts');
    if (!json) {
        return [];
    }
    return JSON.parse(json);
}

export function addWorkoutToList(workout) {
    const { localStorage } = window;

    const json = localStorage.getItem('workouts');
    const workouts = json ? JSON.parse(json) : [];
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
}

export function removeWorkoutFromList(id) {
    const { localStorage } = window;

    const json = localStorage.getItem('workouts');
    const workouts = json ? JSON.parse(json) : [];
    localStorage.setItem('workouts', JSON.stringify(
        workouts.filter(w => w.id !== id)
    ));

    for (const key of Object.keys(localStorage)) {
        if (key.includes(id)) {
            localStorage.removeItem(key);
        }
    }
}

export function getLastRunDate(id) {
    const { localStorage } = window;

    const lastLogKey = Object.keys(localStorage)
        .filter(entry => entry.includes(id))
        .sort()
        .reverse()[0];
    
    if (!lastLogKey) {
        return null;
    }

    return new Date(loadWorkout(lastLogKey).date);
}

export function loadWorkoutById(id) {
    const { localStorage } = window;

    const lastLogKey = Object.keys(localStorage)
        .filter(entry => entry.includes(id))
        .sort()
        .reverse()[0];

    const workout = loadWorkout(lastLogKey) || getWorkoutList().find(
        entry => entry.id === id
    );
    workout.date = new Date();
    workout.isComplete = false;
    workout.duration = 0;

    for (const exercise of workout.exercises) {
        for (const set of exercise.sets) {
            set.stage = 'IDLE';
        }
    }

    return workout;
}

export function loadWorkout(logKey) {
    const { localStorage } = window;

    const json = localStorage.getItem(logKey);

    if (!json) {
        return null;
    }

    const workout = JSON.parse(json);
    workout.date = new Date(workout.date);

    return workout;
}


export function eraseLogEntry(logKey) {
    const { localStorage } = window;

    localStorage.removeItem(logKey);
}

export function eraseWorkout(id) {
    const { localStorage } = window;

    const logKey = `${(new Date()).toISOString().split('T')[0]}_${id}`;
    localStorage.removeItem(logKey);
}

export function saveWorkout(id) {
    const { localStorage } = window;

    const logKey = `${(new Date()).toISOString().split('T')[0]}_${id}`;

    const json = serializeWorkout(id);

    localStorage.setItem(logKey, json);
}