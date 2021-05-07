import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SingleInputForm } from '../ui';

export default function AddExercise(props) {
    const { t } = useTranslation();

    const [ name, setName ] = useState('');
    const { dispatch } = props;

    const onAddExercise = (ev) => {
        ev.preventDefault();
        setName('');
        dispatch({
            type: 'ADD_EXERCISE',
            payload: { name }
        });
    };

    return <SingleInputForm
        onSubmit={onAddExercise}
        onChange={ev => setName(ev.target.value)}
        placeholder={t('exercise_name')}
        label={t('add_exercise')}
        value={name}
    />;
}