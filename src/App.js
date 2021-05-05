import { useReducer, useState } from 'react';

import Actions from './components/Actions';
import Exercise from './components/Exercise';
import genHash from './util/genHash';
import hasIncompleteSets from './util/hasIncompleteSets';

import reducer from './util/reducer';

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
    };

    return (
        <form onSubmit={onAddExercise} className='m-3 pt-3 border-t border-indigo-200'>
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
        isComplete: false,
        name: 'Workout 1',
        activeSetId: null,
        activeExerciseId: null,
        exercises: []
    });

    return (
        <div className='bg-white max-w-5xl m-auto border shadow-md place-self-center'>
            <h2 className='text-2xl text-indigo-800 font-semibold px-3 pt-4'>
                {state.name}
            </h2>
            <main>
                {
                    state.exercises.length > 0 ? (
                        <ul className='flex flex-col space-y-4 p-3'>
                            {
                                state.exercises.map((exercise, i) =>
                                <li key={exercise.id}>
                                    <Exercise
                                        id={exercise.id}
                                        isFirst={i === 0}
                                        isWorkoutComplete={state.isComplete}
                                        isLast={i === state.exercises.length - 1}
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
                {state.isComplete || <AddExercise dispatch={dispatch} />}
            </main>
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
