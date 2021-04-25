import { useEffect, useState } from 'react';

function formatSeconds(seconds) {
    const pad = (val) => `${val % 60}`.padStart(2, '0');
    const minutes = Math.floor(seconds / 60);
    if (minutes === 0) {
        return seconds;
    }
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${minutes}:${pad(seconds)}`;
}

export default function ExerciseSetDisplay(props) {
    const { targetReps = 0, targetWeight = null, targetRest = 0 } = props;

    const [isActive, setIsActive] = useState(false);
    const [isResting, setIsResting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const [reps, setReps] = useState(targetReps);
    const [weight, setWeight] = useState(targetWeight);
    const [duration, setDuration] = useState(0);
    const [rest, setRest] = useState(targetRest);

    // Setup duration timer
    useEffect(() => {
        if (!isActive) {
            setDuration(0);
            return;
        }

        const interval = setInterval(() => {
            setDuration(d => d + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive]);

    // Setup rest countdown
    useEffect(() => {
        if (!isResting) {
            setRest(targetRest);
            return;
        }

        const interval = setInterval(() => {
            setRest(r => r - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isResting, targetRest]);

    const restTotal = rest > 0 ? rest : targetRest - rest;

    const onFocusExerciseSet = () => {
        if (isComplete || isResting) {
            setIsResting(false);
            setIsComplete(false);
            setIsActive(false);
        } else {
            setIsActive(true);
        }
    }

    if (isComplete || isResting) {
        return (
            <div className='set' onClick={onFocusExerciseSet}>
                <span className='duration'>{formatSeconds(duration)}</span>
                <span className='weight'>{weight}</span>
                <span className='reps'>{reps}</span>
                <span className='rest'>{restTotal}</span>
            </div>
        )
    }

    return (
        <div className='set' onClick={onFocusExerciseSet}>
            {isActive &&
                <span className='duration'>{formatSeconds(duration)}</span>}
            <form>
                {Number.isFinite(weight) && <input
                    name='weight'
                    className='weight'
                    placeholder='Weight'
                    type='number'
                    onChange={ev => setWeight(ev.target.value)}
                    value={weight}>
                </input>}
                <input
                    name='reps'
                    placeholder='Reps'
                    className='reps'
                    type='number'
                    onChange={ev => setReps(ev.target.value)}
                    value={reps}>
                </input>
            </form>
            <span className='rest'>{formatSeconds(rest)}</span>
        </div>
    )
}