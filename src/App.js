import { cloneDeep } from "lodash";
import { useReducer, useState } from "react";

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

function addNewExercise(workout, payload) {
    const { name } = payload;
    workout.exercises.push({
        id: genHash(),
        name,
        sets: []
    })
    return workout;
}

function restartWorkout(workout) {
    for (const exercise of workout.exercises) {
        for (const set of exercise.sets) {
            set.stage = 'IDLE';
        }
    }
    workout.activeExerciseId = null;
    workout.activeSetId = null;
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
            return addNewExercise(workout, action.payload);
        case 'RESTART_WORKOUT':
            return restartWorkout(workout);
        case 'UPDATE_EXERCISE':
            return workout;
        default:
            throw new Error();
    }
}

function AddExercise(props) {
    const [ name, setName ] = useState('');
    const { dispatch } = props;

    const onAddExercise = (ev) => {
        ev.preventDefault();
        setName('');
        dispatch({
            type: 'ADD_EXERCISE',
            payload: { name }
        });
    }

    return (
        <form onSubmit={onAddExercise} className='m-3'>
            <div className='flex p-2 items-center bg-indigo-50 rounded-lg border border-indigo-200'>
                <input required value={name} onChange={ev => setName(ev.target.value)} className='text-sm px-2 w-2 flex-1 py-1 rounded border border-indigo-200 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-200' type='text' placeholder='Exercise name' />
            </div>
            <div className='flex justify-end mt-1'>
                <button
                    className='text-blue-500 text-sm px-1'> Add exercise
                </button>
            </div>
        </form>
    );
}

function Workout() {
    const [state, dispatch] = useReducer(reducer, {
        id: genHash(),
        name: 'Workout 1',
        activeSetId: null,
        activeExerciseId: null,
        exercises: []
    });

    return (
        <div className='bg-white max-w-lg m-auto border shadow-md place-self-center'>
            <h2 className='text-2xl text-indigo-800 font-semibold text-center pt-4'>
                {state.name}
            </h2>
            <div className='min-h-screen'>
                {
                    state.exercises.length > 0 ? (
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
                    ) : (
                        <p className='px-3 my-2 text-indigo-500'>No exercises to list.</p>
                    )
                }
                <hr className='border-t border-indigo-200' />
                <AddExercise dispatch={dispatch} />
            </div>
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
