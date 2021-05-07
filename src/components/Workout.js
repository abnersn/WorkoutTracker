import { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';

import Actions from './Actions';
import AddExercise from './AddExercise';
import Exercise from './Exercise';

import hasIncompleteSets from '../util/hasIncompleteSets';
import reducer from '../util/reducer';
import useTranslation from '../hooks/useTranslation';
import useNotification from '../hooks/useNotification';
import usePersistence from '../hooks/usePersistence';
import { BiBell } from 'react-icons/bi';

export default function Workout(props) {
    const { t } = useTranslation();
    const { id, createNew = true } = props;

    const db = usePersistence();
    const {
        requestNotificationPermission,
        hasAskedPermission
    } = useNotification();
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
            <header className='flex items-center pt-4'>
                <h2 className='workout-name text-2xl text-indigo-800 font-semibold px-3 pr-2'>
                    {workout.name}
                </h2>
                <button
                    onClick={requestNotificationPermission}
                    className='p-1 text-base text-indigo-800'
                >
                    {hasAskedPermission || <BiBell className='inline' />}
                </button>
                <Link className='text-blue-500 ml-auto px-3' to='/'>{t('close')}</Link>
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
                                        isReadOnly={!createNew || workout.isComplete}
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