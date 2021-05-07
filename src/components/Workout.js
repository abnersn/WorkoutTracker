import { useEffect, useReducer } from 'react';

import Actions from './Actions';
import AddExercise from './AddExercise';
import Exercise from './Exercise';

import hasIncompleteSets from '../util/hasIncompleteSets';
import reducer from '../util/reducer';
import useTranslation from '../hooks/useTranslation';
import { Link } from 'react-router-dom';
import usePersistence from '../hooks/usePersistence';

export default function Workout(props) {
    const { t } = useTranslation();
    const { id, createNew = true } = props;

    const db = usePersistence();
    const [workout, dispatch] = useReducer(reducer, null);

    useEffect(() => {
        db?.loadWorkoutLogById(id, createNew).then((workout) => {
            dispatch({
                type: 'SET_WORKOUT',
                payload: workout
            });
        });
    }, [db]);

    if (!workout) {
        return null;
    }

    return (
        <div>
            <header className='flex items-center'>
                <h2 className='workout-name text-2xl text-indigo-800 font-semibold px-3 pt-4'>
                    {workout.name}
                </h2>
                <Link className='text-blue-500 ml-auto px-3 pt-4' to='/'>{t('close')}</Link>
            </header>
            <main>
                {
                    workout.exercises.length > 0 ? (
                        <ul className='flex flex-col space-y-4 p-3'>
                            {
                                workout.exercises.map((exercise, i) =>
                                <li key={exercise.id}>
                                    <Exercise
                                        id={exercise.id}
                                        isFirst={i === 0}
                                        isWorkoutComplete={workout.isComplete}
                                        isLast={i === workout.exercises.length - 1}
                                        isActive={exercise.id === workout.activeExerciseId && createNew}
                                        isComplete={!hasIncompleteSets(exercise)}
                                        isReadOnly={!createNew}
                                        name={exercise.name}
                                        sets={exercise.sets}
                                        defaultRPE={exercise.rpe}
                                        activeSetId={workout.activeSetId}
                                        dispatch={dispatch}
                                    />
                                </li>)
                            }
                        </ul>
                    ) : (
                        <p className='px-3 my-2 text-indigo-500'>{t('no_exercise')}</p>
                    )
                }
                {workout.isComplete || !createNew || <AddExercise dispatch={dispatch} />}
            </main>
            <Actions
                isReadOnly={!createNew}
                state={workout}
                dispatch={dispatch}
            />
        </div>
    );
}