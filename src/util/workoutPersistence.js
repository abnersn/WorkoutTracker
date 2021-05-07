import { openDB } from 'idb';

export default class Database {
    constructor() {
        this.db = null;
    }
    async init() {
        if (!('indexedDB' in window)) {
            alert('This app needs indexedDb support to run.');
            return;
        }
        this.db = await openDB('workoutTracker', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('workouts')) {
                    db.createObjectStore('workouts', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('logs')) {
                    db.createObjectStore('logs', { autoIncrement: true });
                }
            }
        });
    }

    async getAllData(storeName) {
        const data = [];

        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);

        let cursor = await store.openCursor();
        while(cursor) {
            const value = cursor.value;
            value.persistenceKey = cursor.key;
            data.push(value);
            cursor = await cursor.continue();
        }

        return data;  
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

    saveWorkout(workout) {
        return this.runInWorkouts((store) => store.add(workout));
    }

    eraseWorkout(id) {
        return this.runInWorkouts((store) => store.delete(id));
    }

    async getLastLogEntry(workoutId) {
        const data = await this.getAllData('logs');

        const lastLogEntry = data
            .filter(entry => entry.id === workoutId)
            .sort((a, b) => b.date - a.date);

        return lastLogEntry[0];
    }

    async loadNewWorkout(id) {
        const lastLogEntry = await this.getLastLogEntry(id);
        const workout = lastLogEntry || await this.getData('workouts', id);

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

    async loadWorkoutFromLogs(id) {
        const workout = await this.getData('logs', id);

        workout.date = new Date(workout.date);

        for (const exercise of workout.exercises) {
            for (const set of exercise.sets) {
                set.stage = 'COMPLETE';
            }
        }
    
        return workout;
    }

    loadWorkoutLogById(id, createNew = true) {
        if (createNew) {
            return this.loadNewWorkout(id);
        }
        return this.loadWorkoutFromLogs(id);
    }
}
