import { useRef, useState } from "react";

import Actions from "./components/Actions";
import Exercise from "./components/Exercise";
import genHash from "./util/genHash";

function getNextStageFor(stage) {
    const stages = ['IDLE', 'ACTIVE', 'RESTING', 'COMPLETE'];
    const index = stages.findIndex(s => s === stage);

    return stages[(index + 1) % stages.length];
}

function App() {
    const [workout, setWorkout] = useState({
        id: genHash(),
        name: 'Workout 1',
        exercises: [
            {
                id: genHash(),
                name: 'Exercise Name',
                sets: [
                    { id: genHash(), stage: 'IDLE' },
                    { id: genHash(), stage: 'IDLE' },
                    { id: genHash(), stage: 'IDLE' }
                ]
            }
        ]
    });
    const exercise = useRef(null);
    const [activeSet, setActiveSet] = useState(null);

    const advanceCurrentSetToNextStage = () => {
        const newSet = {
            ...activeSet,
            stage: getNextStageFor(activeSet.stage)
        }
        const activeSetIndex = exercise.current.sets.findIndex(
            s => s === activeSet
        );
        console.log(activeSet, activeSetIndex, newSet);
        const setsArray = [...exercise.current.sets];
        setsArray.splice(activeSetIndex, 1, newSet);
        exercise.current.sets = setsArray;
        setWorkout(workout);
    }

    const updateActiveSet = (ex, set) => {
        exercise.current = ex;
        setActiveSet(set);
    }

    const addNewSet = () => {
        if (activeSet) {
            return;
        }
        exercise.current.exercises = exercise.current.exercises.concat({
            id: genHash(), stage: 'IDLE'
        });
        setWorkout(workout);
    }

    const removeSet = () => {
        exercise.current.exercises = exercise.current.exercises.filter(
            s => s.id !== activeSet
        );
        setWorkout(workout);
    }

    return (
        <div className='bg-white p-2'>
            {
                workout.exercises.map(exercise => <Exercise
                    key={exercise.id}
                    name={exercise.name}
                    sets={exercise.sets}
                    activeSet={activeSet}
                    onClickSet={set => updateActiveSet(exercise, set)}
                    onAddSet={addNewSet}
                    onRemoveSet={removeSet}
                />)
            }
            <Actions
                onActionButtonClick={advanceCurrentSetToNextStage}
                exercise={exercise.current}
                set={activeSet}
            />
        </div>
    );
}

export default App;
