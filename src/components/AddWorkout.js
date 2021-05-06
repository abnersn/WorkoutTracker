import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AddWorkout(props) {
    const { t } = useTranslation();

    const [ name, setName ] = useState('');

    const { onAddWorkout = () => {} } = props;

    const onSubmit = (ev) => {
        ev.preventDefault();
        onAddWorkout(name);
        setName('');
    };

    return (
        <form onSubmit={onSubmit} className='m-3 pt-3 border-t border-indigo-200'>
            <div className='flex p-2 items-center bg-indigo-50 rounded-xl border border-indigo-200'>
                <input required value={name} onChange={ev => setName(ev.target.value)}
                    className='text-sm text-indigo-800 px-2 w-2 flex-1 py-1 rounded border border-indigo-200 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-200'
                    type='text' placeholder={t('workout_name')} />
            </div>
            <div className='flex justify-end mt-1'>
                <button
                    className='text-blue-500 text-sm px-1'> {t('add_workout')}
                </button>
            </div>
        </form>
    );
}