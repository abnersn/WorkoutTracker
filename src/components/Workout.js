import { useReducer } from 'react';

import Actions from './Actions';
import AddExercise from './AddExercise';
import Exercise from './Exercise';

import hasIncompleteSets from '../util/hasIncompleteSets';
import reducer from '../util/reducer';
import { useTranslation } from 'react-i18next';
import { loadWorkoutById } from '../util/workoutPersistence';

export default function Workout(props) {
    const { t } = useTranslation();
    const { savedWorkout = null, location } = props;

    const id = new URLSearchParams(location.search).get('id');

    const [state, dispatch] = useReducer(reducer, loadWorkoutById(id));

    const isReadOnly = Boolean(savedWorkout);

    return (
        <div className='bg-white max-w-5xl m-auto border shadow-md place-self-center'>
            <h2 className='workout-name text-2xl text-indigo-800 font-semibold px-3 pt-4'>
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
                                        isActive={exercise.id === state.activeExerciseId && !isReadOnly}
                                        isComplete={!hasIncompleteSets(exercise)}
                                        isReadOnly={isReadOnly}
                                        name={exercise.name}
                                        sets={exercise.sets}
                                        defaultRPE={exercise.rpe}
                                        activeSetId={state.activeSetId}
                                        dispatch={dispatch}
                                    />
                                </li>)
                            }
                        </ul>
                    ) : (
                        <p className='px-3 my-2 text-indigo-500'>{t('no_exercise')}</p>
                    )
                }
                {state.isComplete || isReadOnly || <AddExercise dispatch={dispatch} />}
            </main>
            <Actions
                isReadOnly={isReadOnly}
                state={state}
                dispatch={dispatch}
            />
        </div>
    );
}