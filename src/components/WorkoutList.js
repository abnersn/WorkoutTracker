import { useEffect, useState } from 'react';
import useTranslation from '../hooks/useTranslation';
import AddWorkout from './AddWorkout';
import WorkoutDisplay from './WorkoutDisplay';

import genHash from '../util/genHash';
import usePersistence from '../hooks/usePersistence';

export default function WorkoutList() {
    const db = usePersistence();
    const { t } = useTranslation();
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        db?.getAllData('workouts').then(setWorkouts);
    }, [db]);

    const onAddWorkout = async (name) => {
        const workout = {
            id: genHash(), name, exercises: []
        };

        if (db) {
            await db.saveWorkout(workout);
        }

        setWorkouts(workouts.concat([workout]));
    };

    const onRemoveWorkout = async (id) => {
        const willRemove = window.confirm(t('confirm_delete'));
        if (willRemove) {
            if (db) {
                await db.eraseWorkout(id);
            }

            setWorkouts(workouts.filter(w => w.id !== id));

            // Lazy solution to refresh history list
            window.location.reload();
        }
    };

    return (
        <div>
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
