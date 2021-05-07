import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import en from 'date-fns/locale/en-US';

const locales = { pt, en };

import { useState } from 'react';
import useTranslation from '../hooks/useTranslation';
import { BiDumbbell, BiTrash } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { eraseLogEntry, workoutHistoryList } from '../util/workoutPersistence';

export default function WorkoutHistory() {
    const [workoutsList, setWorkoutsList] = useState(workoutHistoryList());

    const { t, language } = useTranslation();

    const onClickRemove = (logKey) => {
        eraseLogEntry(logKey);
        setWorkoutsList(workoutsList.filter(w => w.persistenceKey !== logKey));
    };

    if (!workoutsList.length) {
        return null;
    }

    const locale = locales[language];
    const formatOptions = {};
    if (locale) {
        formatOptions.locale = locale;
    }

    return <div>
        <h2 className='workout-name text-2xl text-blue-800 font-semibold px-3 pt-4'>
            {t('history')}
        </h2>
        <ul className='flex flex-col space-y-4 p-3'>{
            workoutsList.map((workout) => 
                <Link to={{
                    pathname: '/viewWorkout',
                    search: `?id=${workout.id}`
                }} key={workout.id} className='p-2 border border-blue-200 relative flex flex-wrap bg-blue-50 rounded-xl'>
                    <button
                        onClick={() => onClickRemove(workout.persistenceKey)}
                        className='absolute p-2 top-0 right-0 text-blue-400'><BiTrash /></button>
                    <h2 className='text-blue-700 w-full text-md'><BiDumbbell className='-mt-1 inline text-lg' /> {workout.name}</h2>
                    <p className='text-blue-600 text-sm'>{format(new Date(workout.date), 'PP', formatOptions)}</p>
                </Link>
            )
        }</ul>
    </div>;
}