import { useState } from "react";

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
