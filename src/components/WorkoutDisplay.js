import { formatDistance } from 'date-fns';
import useTranslation from '../hooks/useTranslation';
import { BiDumbbell, BiTrash } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { getLastRunDate } from '../util/workoutPersistence';

import pt from 'date-fns/locale/pt-BR';
import en from 'date-fns/locale/en-US';

const locales = { pt, en };

export default function WorkoutDisplay(props) {
    const { name, onRemoveWorkout, id } = props;

    const { t, language } = useTranslation();

    const lastRun = getLastRunDate(id);

    const locale = locales[language];
    const formatOptions = {};
    if (locale) {
        formatOptions.locale = locale;
    }

    return (
        <div className='p-2 border border-indigo-200 relative flex flex-wrap bg-indigo-50 rounded-xl'>
            <button onClick={() => onRemoveWorkout(id)} className='p-2 absolute top-0 right-0 text-indigo-400'><BiTrash /></button>
            <h2 className='text-indigo-700 w-full text-md'><BiDumbbell className='-mt-1 inline text-lg' /> {name}</h2>
            {lastRun && (
                <p className='text-indigo-600 text-sm'>
                    {t('last_run')}: {formatDistance(lastRun, new Date(), formatOptions)}
                </p>
            )}
            <Link
                to={{ pathname: '/newWorkout', search: `?id=${id}` }}
                className='bg-indigo-600 text-white block px-3 py-2 rounded shadow focus:ring-2 focus:ring-indigo-300 ml-auto mt-2 text-xs uppercase tracking-wider'>
                    {t('start')}
                </Link>
        </div>
    );
}