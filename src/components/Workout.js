import Actions from './Actions';
import AddExercise from './AddExercise';
import Exercise from './Exercise';

import genHash from '../util/genHash';
import hasIncompleteSets from '../util/hasIncompleteSets';
import reducer from '../util/reducer';

export default function Workout() {
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