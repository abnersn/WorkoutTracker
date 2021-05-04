import { cloneDeep } from "lodash";
import { useReducer, useRef, useState } from "react";

import Actions from "./components/Actions";
import Exercise from "./components/Exercise";
import genHash from "./util/genHash";

function getNextStageFor(stage) {
    const stages = ['IDLE', 'ACTIVE', 'RESTING', 'COMPLETE'];
    const index = stages.findIndex(s => s === stage);

    return stages[(index + 1) % stages.length];
}

function addNewSet(workout, exerciseId) {
    const newWorkout = cloneDeep(workout);
    const exercise = newWorkout.exercises.find(
        ex => ex.id === exerciseId
    );
    exercise.sets = [
        ...exercise.sets,
        { id: genHash(), stage: 'IDLE' }
    ];
    return newWorkout;
}

function removeSet(workout, exerciseId) {
    const newWorkout = cloneDeep(workout);
    const exercise = newWorkout.exercises.find(
        ex => ex.id === exerciseId
    );
    const setIndex = exercise.sets.findIndex(s => s.id === workout.activeSetId);
    if (setIndex !== -1) {
        exercise.sets.splice(setIndex, 1);
        newWorkout.activeSetId = null;
    }
    return newWorkout;
}

function updateActiveSet(workout, setId) {
    const newWorkout = cloneDeep(workout);
    newWorkout.activeSetId = setId;
    return newWorkout;
}

function reducer(state, action) {
    const newState = cloneDeep(state);
    switch(action.type) {
        case 'ADD_SET': {
            const { exerciseId } = action.payload;
            return addNewSet(state, exerciseId);
        }
        case 'REMOVE_SET': {
            const { exerciseId } = action.payload;
            return removeSet(state, exerciseId);
        }
        case 'UPDATE_ACTIVE_SET': {
            const { setId } = action.payload;
            return updateActiveSet(state, setId);
        }
        case 'UPDATE_SET_STAGE':
            return newState;
        case 'ADD_EXERCISE':
            return newState;
        case 'REMOVE_EXERCISE':
            return newState;
        case 'UPDATE_EXERCISE':
            return newState;
        default:
            throw new Error();
    }
}

function Workout() {
    const [state, dispatch] = useReducer(reducer, {
        id: genHash(),
        name: 'Workout 1',
        activeSetId: null,
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

    return (
        <div className='bg-white p-2'>
            {
                state.exercises.map(exercise => <Exercise
                    key={exercise.id}
                    id={exercise.id}
                    name={exercise.name}
                    sets={exercise.sets}
                    activeSetId={state.activeSetId}
                    dispatch={dispatch}
                />)
            }
            <Actions
                dispatch={dispatch}
            />
        </div>
    );
}

function App() {
    return (<Workout />);
}

export default App;
