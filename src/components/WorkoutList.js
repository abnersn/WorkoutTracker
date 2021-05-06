import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddWorkout from './AddWorkout';
import WorkoutDisplay from './WorkoutDisplay';

import genHash from '../util/genHash';
import {
    addWorkoutToList,
    getWorkoutList,
    removeWorkoutFromList
} from '../util/workoutPersistence';

export default function WorkoutList() {
    const { t } = useTranslation();
    const [workouts, setWorkouts] = useState(getWorkoutList());

    const onAddWorkout = (name) => {
        const workout = {
            id: genHash(), name, exercises: []
        };
        addWorkoutToList(workout);
        setWorkouts(workouts.concat([workout]));
    };

    const onRemoveWorkout = (id) => {
        const willRemove = window.confirm(t('confirm_delete'));
        if (willRemove) {
            removeWorkoutFromList(id);
            setWorkouts(workouts.filter(w => w.id !== id));
        }
    };

    return (
        <div className='bg-white max-w-5xl min-h-screen m-auto border shadow-md place-self-center'>
            <h2 className='workout-name text-2xl text-indigo-800 font-semibold px-3 pt-4'>
                {t('workouts_list')}
            </h2>
            {
                workouts.length > 0 ? (
                    <ul className='flex flex-col space-y-4 p-3'>
                        {
                            workouts.map((workout) =>
                                <WorkoutDisplay
                                    key={workout.id}
                                    id={workout.id}
                                    name={workout.name}
                                    onRemoveWorkout={onRemoveWorkout}
                                />)
                        }
                    </ul>
                ) : (
                    <p className='px-3 my-2 text-indigo-500'>{t('no_workout')}</p>
                )
            }
            <AddWorkout onAddWorkout={onAddWorkout} />
        </div>
    );
}
