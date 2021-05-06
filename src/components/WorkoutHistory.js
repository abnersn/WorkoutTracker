import { format } from 'date-fns';
import { useState } from 'react';
import { BiDumbbell, BiTrash } from 'react-icons/bi';
import { eraseLogEntry, workoutHistoryList } from '../util/workoutPersistence';

export default function WorkoutHistory() {
    const [workoutsList, setWorkoutsList] = useState(workoutHistoryList());

    const onClickRemove = (logKey) => {
        eraseLogEntry(logKey);
        setWorkoutsList(workoutsList.filter(w => w.persistenceKey !== logKey));
    };

    if (!workoutsList.length) {
        return null;
    }

    return <div>
        <h2 className='workout-name text-2xl text-indigo-800 font-semibold px-3 pt-4'>
            History
        </h2>
        <ul className='flex flex-col space-y-4 p-3'>{
            workoutsList.map((workout) => 
                <div key={workout.id} className='p-2 border border-indigo-200 relative flex flex-wrap bg-indigo-50 rounded-xl'>
                    <button
                        onClick={() => onClickRemove(workout.persistenceKey)}
                        className='absolute top-2 right-2 text-indigo-400'><BiTrash /></button>
                    <h2 className='text-indigo-700 w-full text-md'><BiDumbbell className='-mt-1 inline text-lg' /> {workout.name}</h2>
                    <p className='text-indigo-600 text-sm'>{format(new Date(workout.date), 'PP')}</p>
                    <Link
                        className='bg-blue-600 text-white block px-2 py-1 rounded shadow focus:ring-2 focus:ring-blue-300 ml-auto mt-2 text-xs uppercase tracking-wider'
                        to={{
                            pathname: '/viewWorkout',
                            search: `?id=${workout.id}`
                        }}
                    >View</Link>
                </div>
            )
        }</ul>
    </div>;
}