import serializeWorkout from '../util/serializeWorkout';

export default class Database {
    constructor() {
        this.db = null;
    }
    async init() {
        if (!('indexedDb' in window)) {
            alert('This app needs indexedDb support to run.');
            return;
        }
        this.db = await indexedDB.open('workoutTracker', 1, (upgradeDb) => {
            if (!upgradeDb.objectStoreNames.contains('workouts')) {
                upgradeDb.createObjectStore('workouts', { keyPath: 'id' });
            }
            if (!upgradeDb.objectStoreNames.contains('logs')) {
                upgradeDb.createObjectStore('logs', { autoIncrement: true });
            }
        });
    }

    getAllData(storeName) {
        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        return store.getAll();  
    }

    getData(storeName, key) {
        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        return store.get(key);  
    }

    runInWorkouts(operation) {
        const transaction = this.db.transaction('workouts', 'readwrite');
        const store = transaction.objectStore('workouts');
        operation(store);
        return transaction.complete;  
    }

    runInLogs(operation) {
        const transaction = this.db.transaction('logs', 'readwrite');
        const store = transaction.objectStore('logs');
        operation(store);
        return transaction.complete;  
    }

    saveLogEntry(logEntry) {
        return this.runInLogs((store) => store.add(logEntry));
    }

    eraseLogEntry(key) {
        return this.runInLogs((store) => store.delete(key));
    }

    eraseWorkout(id) {
        return this.runInWorkouts((store) => store.delete(id));
    }

    async getLastLogEntry(workoutId) {
        const lastLogEntry = (await this.getAllData('logs'))
            .filter(entry => entry.id === workoutId)
            .sort((a, b) => b.date - a.date);

            return lastLogEntry;
    }

    async loadWorkoutLogById(id, createNew = true) {
        const lastLogEntry = await this.getLastLogEntry(id);
    
        const workout = lastLogEntry || await this.getData('workouts', id);
    
        if (createNew) {
            workout.date = new Date();
            workout.isComplete = false;
            workout.duration = 0;
        } else {
            workout.date = new Date(workout.date);
        }
    
        for (const exercise of workout.exercises) {
            for (const set of exercise.sets) {
                set.stage = createNew ? 'IDLE' : 'COMPLETE';
            }
        }
    
        return workout;
    }
}

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

export function loadWorkoutById(id, createNew = true) {
    const { localStorage } = window;

    const lastLogKey = Object.keys(localStorage)
        .filter(entry => entry.includes(id))
        .sort()
        .reverse()[0];

    const workout = loadWorkout(lastLogKey) || getWorkoutList().find(
        entry => entry.id === id
    );

    if (createNew) {
        workout.date = new Date();
        workout.isComplete = false;
        workout.duration = 0;
    } else {
        workout.date = new Date(workout.date);
    }

    for (const exercise of workout.exercises) {
        for (const set of exercise.sets) {
            set.stage = createNew ? 'IDLE' : 'COMPLETE';
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