import { formatDistance } from 'date-fns';
import useTranslation from '../hooks/useTranslation';
import { BiDumbbell, BiTrash } from 'react-icons/bi';
import { Link } from 'react-router-dom';

import pt from 'date-fns/locale/pt-BR';
import en from 'date-fns/locale/en-US';
import usePersistence from '../hooks/usePersistence';
import { useEffect, useState } from 'react';

const locales = { pt, en };

export default function WorkoutDisplay(props) {
    const { name, onRemoveWorkout, id } = props;

    const [lastRun, setLastRun] = useState(null);
    const db = usePersistence();
    const { t, language } = useTranslation();

    useEffect(async () => {
        db?.getLastLogEntry(id).then(lastEntry => {
            if (lastEntry) {
                setLastRun(lastEntry.date);
            }
        });
    }, [db]);

    const locale = locales[language];
    const formatOptions = {};
    if (locale) {
        formatOptions.locale = locale;
    }

    return (
        <Link to={{ pathname: '/newWorkout', search: `?id=${id}` }} className='p-2 border border-indigo-200 relative flex flex-wrap bg-indigo-50 rounded-xl'>
            <button onClick={(ev) => {
                onRemoveWorkout(id);
                ev.preventDefault();
            }} className='p-2 absolute top-0 right-0 text-indigo-400'><BiTrash /></button>
            <h2 className='text-indigo-700 w-full text-md'><BiDumbbell className='-mt-1 inline text-lg' /> {name}</h2>
            {lastRun && (
                <p className='text-indigo-600 text-sm'>
                    {t('last_run')}: {formatDistance(lastRun, new Date(), formatOptions)}
                </p>
            )}
        </Link>
    );
}