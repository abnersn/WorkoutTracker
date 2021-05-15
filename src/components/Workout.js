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
import { BiBell, BiChevronLeft, BiSave } from 'react-icons/bi';
import useTimer from '../hooks/useTimer';
import { getWorkout } from '../util/serializeWorkout';

export default function Workout(props) {
    const { t } = useTranslation();
    const { id, createNew = true } = props;

    const db = usePersistence();
    const {
        requestNotificationPermission,
        hasAskedPermission
    } = useNotification();
    const [workout, dispatch] = useReducer(reducer, null);
    const timer = useTimer('mainTimer', 0);

    useEffect(() => {
        db?.loadWorkoutLogById(id, createNew).then((workout) => {
            dispatch({
                type: 'SET_WORKOUT',
                payload: workout
            });
            timer.set(workout.duration);
        });
    }, [db]);

    const onSaveWorkout = () => {
        const uiWorkout = getWorkout(workout.id);
        db.saveWorkoutTemplate(workout.id, uiWorkout.exercises);
    };

    if (!workout) {
        return null;
    }

    return (
        <div>
            <header className='flex items-center pt-4'>
                <Link className='text-indigo-500 px-3 pr-0 text-xl' to='/'><BiChevronLeft /></Link>
                <h2 className='workout-name text-2xl text-indigo-800 font-semibold px-3 pr-2'>
                    {workout.name}
                </h2>
                {hasAskedPermission ||
                <button
                    onClick={requestNotificationPermission}
                    className='p-1 text-base text-indigo-800'
                >
                    <BiBell className='inline' />
                </button>}
                {createNew && !timer.isRunning && !workout.isComplete &&
                <button onClick={onSaveWorkout} className='text-indigo-500 px-3 ml-auto text-xl' to='/'>
                    <BiSave />
                </button>}
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
                                        defaultType={exercise.type}
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
                timer={timer}
                isReadOnly={!createNew}
                state={workout}
                dispatch={dispatch}
            />
        </div>
    );
}