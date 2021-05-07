import { format } from 'date-fns';

import pt from 'date-fns/locale/pt-BR';
import en from 'date-fns/locale/en-US';

const locales = { pt, en };

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BiArrowBack,
    BiCheck,
    BiPause,
    BiPlay,
    BiRefresh,
    BiStar,
    BiStopwatch,
    BiTrophy
} from 'react-icons/bi';
import hasIncompleteExercises from '../util/hasIncompleteExercises';
import hasIncompleteSets from '../util/hasIncompleteSets';
import timeFormat from '../util/timeFormat';

import { saveWorkout } from '../util/workoutPersistence';
import { useHistory } from 'react-router';
import { Button, DecoratedBlock, Footer, TextLabel } from '../ui';

function CycleButton({ stage, onClick = () => {} }) {
    const { t } = useTranslation();
    
    const labels = {
        IDLE: t('start'),
        ACTIVE: t('rest'),
        RESTING: t('complete'),
        COMPLETE: t('reset')
    };

    const icons = {
        IDLE: BiPlay,
        ACTIVE: BiPause,
        RESTING: BiCheck,
        COMPLETE: BiRefresh
    };

    const colors = {
        IDLE: 'indigo',
        ACTIVE: 'indigo',
        RESTING: 'indigo',
        COMPLETE: 'blue'
    };

    const label = labels[stage];
    const Icon = icons[stage];
    const color = colors[stage];

    return (
        <Button
            onClick={onClick}
            color={color}
            label={label}
            Icon={Icon}
        />
    );
}

export default function Actions(props) {
    const { state, dispatch, isReadOnly } = props;

    const { t, i18n } = useTranslation();
    const history = useHistory();

    const [timer, setTimer] = useState(state.duration || 0);
    const [isComplete, setIsComplete] = useState(false);
    const [timerIsRunning, setTimerIsRunning] = useState(false);

    useEffect(() => {
        if (!timerIsRunning) {
            return;
        }
        const interval = setInterval(() => {
            setTimer(t => t + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timerIsRunning]);

    const updateStage = () => {
        dispatch({
            type: 'UPDATE_SET_STAGE'
        });
    };

    const completeExercise = () => {
        dispatch({
            type: 'COMPLETE_EXERCISE'
        });
    };

    const completeWorkout = () => {
        const willSave = window.confirm(
            t('save_progress')
        );
        if (willSave) {
            saveWorkout(state.id);
        }
        setIsComplete(true);
        setTimerIsRunning(false);
        dispatch({
            type: 'COMPLETE_WORKOUT'
        });
    };

    const onStartWorkout = () => {
        setTimerIsRunning(true);
        dispatch({
            type: 'UPDATE_ACTIVE_SET',
            payload: {
                exerciseId: state.exercises[0]?.id,
                setId: state.exercises[0]?.sets[0]?.id,
            }
        });
        dispatch({
            type: 'UPDATE_SET_STAGE'
        });
    };

    const onGoBack = () => {
        history.push('/');
    };

    let footerButtons = [null, null];

    const exercise = state.exercises.find(
        e => e.id === state.activeExerciseId
    );

    const set = exercise ? exercise.sets.find(
        s => s.id === state.activeSetId
    ) : null;

    const hasActiveSet = Boolean(set);
    const hasExercises = state.exercises.length > 0;
    const hasSets = state.exercises[0]?.sets.length > 0;

    if (isReadOnly) {
        footerButtons[0] = <Button
            color='blue'
            label={t('back')}
            onClick={onGoBack}
            Icon={BiArrowBack}
        />;
    } else if (isComplete) {
        footerButtons[0] = <Button
            color='blue'
            label={t('back')}
            onClick={onGoBack}
            Icon={BiArrowBack}
        />;
    } else if (timerIsRunning) {
        if (hasActiveSet) {
            footerButtons[0] = <CycleButton
                onClick={updateStage}
                stage={set.stage}
            />;
        }
    
        if (!hasIncompleteExercises(state)) {
            footerButtons[1] = <Button
                color='green'
                label={t('finish_workout')}
                Icon={BiTrophy}
                onClick={completeWorkout}
            />;
        } else if (!hasIncompleteSets(exercise)) {
            footerButtons[1] = <Button
                color='green'
                label={t('finish_exercise')}
                Icon={BiStar}
                onClick={completeExercise}
            />;
        }
    } else if (hasExercises && hasSets && !isComplete) {
        footerButtons[0] = <Button
            color='blue'
            label={t('start_workout')}
            onClick={onStartWorkout}
            Icon={BiPlay}
        />;
    }

    const timerColor = timerIsRunning || !isComplete ? 'indigo' : 'green';
    const locale = locales[i18n.language.split('-')[0]];
    const formatOptions = {};
    if (locale) {
        formatOptions.locale = locale;
    }

    const date = state.date || new Date();
    return (
        <Footer>
            <DecoratedBlock color={timerColor}>
                <BiStopwatch className='inline -mt-1 mr-1 -ml-1' />
                <time
                    className='workout-duration'
                    data-value={timer}
                >{timeFormat(timer)}</time>
                <TextLabel size='xs'>
                    {format(date, 'PP', formatOptions)}
                </TextLabel>
            </DecoratedBlock>
            {footerButtons[0]} {footerButtons[1]}
        </Footer>
    );
}