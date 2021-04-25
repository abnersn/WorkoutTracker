import { useState } from "react";

class Exercise {
    constructor(name = '') {
        this.id =crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
        this.reps = [];
        this.name = name;
    }
}

class Workout {
    constructor(name = '') {
        this.id =crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
        this.exercises = [];
        this.name = name;
    }
    addExercise(exercise) {
        this.exercises = this.exercises.concat(exercise);
    }
    removeExercise(id) {
        this.exercises = this.exercises.filter(e => e.id !== id);
    }
}

function Workout({ data, id, onUpdate }) {
    const [isEdit, setIsEdit] = useState(false);
    const [editName, setEditName] = useState('');

    function toggleEditMode() {
        setIsEdit(!isEdit);
    }

    function saveWorkout() {
        onUpdate(id, {
            ...data,
            name: editName
        })
    }

    function cancelEditions() {
        setEditName(editName);
        toggleEditMode(false);
    }

    return (
        <div>
            {!isEdit && <h3>{data.name}</h3>}
            {isEdit &&
                <div>
                    <input
                        type='text'
                        onChange={ev => setEditName(ev.target.value)}
                    ></input>
                    <button onClick={saveWorkout}>Save</button>
                    <button onClick={cancelEditions}>Cancel</button>
                </div>}
            {!isEdit && <button onClick={toggleEditMode}>Edit</button>}
        </div>
    )
}

function App() {
    const [workouts, setWorkouts] = useState([]);

    function addNewWorkout() {
        const workout = generateNewWorkout();
        setWorkouts(workouts.concat(workout));
    }

    function removeWorkout(id) {
        setWorkouts(workouts.filter(w => w.id !== id));
    }

    function updateWorkout()
    return (
        <div class="bg-purple-100 w-full h-full">
            <h1>Workouts</h1>
            <ul>
                <li><Workout data={{ name: 'Test' }} onUpdate={() => {}} /></li>
            </ul>
            <h2>Exercises</h2>
        </div>
    );
}

export default App;
