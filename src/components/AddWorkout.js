import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SingleInputForm } from '../ui';

export default function AddWorkout(props) {
    const { t } = useTranslation();

    const [ name, setName ] = useState('');

    const { onAddWorkout = () => {} } = props;

    const onSubmit = (ev) => {
        ev.preventDefault();
        onAddWorkout(name);
        setName('');
    };

    return <SingleInputForm
        onSubmit={onSubmit}
        onChange={ev => setName(ev.target.value)}
        placeholder={t('workout_name')}
        label={t('add_workout')}
        value={name}
    />;
}