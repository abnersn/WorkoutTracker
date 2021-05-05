import { format } from 'date-fns';
import { useEffect, useState } from 'react';
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

import Button from './Button';

function saveWorkout() {
    
}

function CycleButton({ stage, onClick = () => {} }) {
    const labels = {
        IDLE: 'Start',
        ACTIVE: 'Rest',
        RESTING: 'Complete',
        COMPLETE: 'Reset'
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

    const [timer, setTimer] = useState(0);
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
            'Would you like to save your progress?'
        );
        if (willSave) {
            saveWorkout();
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

    const onRestartWorkout = () => {
        const willReset = window.confirm(
            'Are you sure you want to erase the current workout?'
        );
        if (willReset) {
            setTimer(0);
            setIsComplete(false);
            dispatch({
                type: 'RESTART_WORKOUT'
            });
        }
    };

    const onGoBack = () => {

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
            label='Back'
            onClick={onGoBack}
            Icon={BiArrowBack}
        />;
    } else if (isComplete) {
        footerButtons[0] = <Button
            color='indigo'
            label='Reset workout'
            onClick={onRestartWorkout}
            Icon={BiRefresh}
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
                label='Finish Workout'
                Icon={BiTrophy}
                onClick={completeWorkout}
            />;
        } else if (!hasIncompleteSets(exercise)) {
            footerButtons[1] = <Button
                color='green'
                label='Finish exercise'
                Icon={BiStar}
                onClick={completeExercise}
            />;
        }
    } else if (hasExercises && hasSets && !isComplete) {
        footerButtons[0] = <Button
            color='blue'
            label='Start workout'
            onClick={onStartWorkout}
            Icon={BiPlay}
        />;
    }

    const timerColor = timerIsRunning || !isComplete ? 'indigo' : 'green';

    return (
        <div className='flex justify-end sticky items-center border-t border-indigo-200 bottom-0 bg-white w-full left-0 p-3'>
            <div className={`text-xl mr-auto border-l-2 border-${timerColor}-500 pl-2 bg-white text-${timerColor}-700`}>
                <BiStopwatch className='inline -mt-1' /> <time>{timeFormat(timer)}</time>
                <p className='text-xs uppercase tracking-wider'>{format(new Date(), 'PP')}</p>
            </div>
            {footerButtons}
        </div>
    );
}