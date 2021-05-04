import { cloneDeep } from "lodash";
import { useReducer } from "react";

import Actions from "./components/Actions";
import Exercise from "./components/Exercise";
import genHash from "./util/genHash";
import hasIncompleteSets from "./util/hasIncompleteSets";

function getNextStageFor(stage) {
    const stages = ['IDLE', 'ACTIVE', 'RESTING', 'COMPLETE'];
    const index = stages.findIndex(s => s === stage);

    return stages[(index + 1) % stages.length];
}

function addNewSet(workout, payload) {
    const { exerciseId } = payload;

    const exercise = workout.exercises.find(
        ex => ex.id === exerciseId
    );
    const hash = genHash();
    exercise.sets = [
        ...exercise.sets,
        { id: hash, stage: 'IDLE' }
    ];
    workout.activeSetId = hash;
    return workout;
}

function removeSet(workout, payload) {
    const { exerciseId } = payload;

    const exercise = workout.exercises.find(
        ex => ex.id === exerciseId
    );
    const setIndex = exercise.sets.findIndex(s => s.id === workout.activeSetId);
    if (setIndex !== -1) {
        exercise.sets.splice(setIndex, 1);
        workout.activeSetId = null;
    }
    return workout;
}

function updateActiveSet(workout, payload) {
    const { setId, exerciseId } = payload;

    workout.activeSetId = setId;
    workout.activeExerciseId = exerciseId;

    return workout;
}

function updateSetStage(workout, stage) {
    const exercise = workout.exercises.find(
        ex => ex.id === workout.activeExerciseId
    );
    const setIndex = exercise.sets.findIndex(
        s => s.id === workout.activeSetId
    );
    if (setIndex === -1) {
        return workout;
    }

    const currentStage = exercise.sets[setIndex].stage;
    const nextStage = stage || getNextStageFor(
        currentStage
    );

    if (nextStage === 'COMPLETE' && !stage) {
        const nextIndex = (setIndex + 1) % exercise.sets.length;
        workout.activeSetId = nextIndex > 0 ?
            exercise.sets[
                (setIndex + 1) % exercise.sets.length
            ].id :
            null;
    }

    exercise.sets[setIndex].stage = nextStage;

    if (!hasIncompleteSets(exercise)) {
        workout.activeSetId = null;
    }

    return workout;
}

function updateActiveExercise(workout) {
    const activeExerciseIdx = workout.exercises.findIndex(
        ex => ex.id === workout.activeExerciseId
    );
    const nextExerciseIdx = (activeExerciseIdx + 1) % workout.exercises.length;
    const nextExercise = workout.exercises[nextExerciseIdx];
    workout.activeExerciseId = nextExercise.id;
    workout.activeSetId = nextExercise.sets[0]?.id || null;

    return workout;
}

function reducer(state, action) {
    const workout = cloneDeep(state);

    switch(action.type) {
        case 'ADD_SET':
            return addNewSet(workout, action.payload);
        case 'REMOVE_SET':
            return removeSet(workout, action.payload);
        case 'UPDATE_ACTIVE_SET':
            return updateActiveSet(workout, action.payload);
        case 'UPDATE_SET_STAGE':
            return updateSetStage(workout);
        case 'COMPLETE_EXERCISE':
            return updateActiveExercise(workout);
        case 'ADD_EXERCISE':
            return workout;
        case 'REMOVE_EXERCISE':
            return workout;
        case 'UPDATE_EXERCISE':
            return workout;
        default:
            throw new Error();
    }
}

function Workout() {
    const [state, dispatch] = useReducer(reducer, {
        id: genHash(),
        name: 'Workout 1',
        activeSetId: null,
        activeExerciseId: null,
        exercises: [
            {
                id: genHash(),
                name: 'Exercise Name',
                sets: [
                    { id: genHash(), stage: 'IDLE' },
                    { id: genHash(), stage: 'IDLE' },
                    { id: genHash(), stage: 'IDLE' }
                ]
            },
            {
                id: genHash(),
                name: 'Another exercise',
                sets: [
                    { id: genHash(), stage: 'IDLE' },
                    { id: genHash(), stage: 'IDLE' },
                    { id: genHash(), stage: 'IDLE' }
                ]
            }
        ]
    });

    return (
        <div className='bg-white'>
            <h2>{state.name}</h2>
            <ul className='flex flex-col space-y-4 p-3'>
                {
                    state.exercises.map(exercise =>
                    <li key={exercise.id}>
                        <Exercise
                            id={exercise.id}
                            isActive={exercise.id === state.activeExerciseId}
                            isComplete={!hasIncompleteSets(exercise)}
                            name={exercise.name}
                            sets={exercise.sets}
                            activeSetId={state.activeSetId}
                            dispatch={dispatch}
                        />
                    </li>)
                }
            </ul>
            <button>Add exercise</button>
            <Actions
                state={state}
                dispatch={dispatch}
            />
        </div>
    );
}

function App() {
    return (<Workout />);
}

export default App;
