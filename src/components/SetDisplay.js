import { useEffect, useState } from "react";
import timeFormat from "../util/timeFormat";
import SetInputField from "./SetInputField";

export default function SetDisplay(props) {
    const {
        defaultRestTime = 30,
        defaultReps = 8,
        defaultWeight = 10,
        stage = 'IDLE'
    } = props;

    const [durationTime, setDurationTime] = useState(0);
    const [restTime, setRestTime] = useState(defaultRestTime)
    const [reps, setReps] = useState(defaultReps);
    const [weight, setWeight] = useState(defaultWeight);

    useEffect(() => {
        if (stage === 'ACTIVE') {
            const interval = setInterval(() => {
                setDurationTime((t) => t + 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (stage === 'IDLE') {
            setDurationTime(0);
        }
    }, [stage]);

    useEffect(() => {
        if (stage === 'RESTING') {
            const interval = setInterval(() => {
                setRestTime((t) => t - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (stage === 'IDLE') {
            setRestTime(defaultRestTime);
        }
    }, [stage, defaultRestTime]);

    return (
        <div>
            <div className='time'>
                <SetInputField
                    inputProps={{
                        name: 'time-input',
                        type: 'number',
                        onChange: ev => setDurationTime(ev.target.value),
                        pattern: '\d+',
                        min: '0',
                        inputMode: 'numeric',
                        value: {durationTime}
                    }}
                    formatFunction={timeFormat}
                    labelText='Time'
                    defaultValue='0'
                />
            </div>
            <div className='reps'>
                <SetInputField
                    inputProps={{
                        name: 'reps-input',
                        type: 'number',
                        onChange: ev => setReps(ev.target.value),
                        pattern: '\d+',
                        min: '0',
                        inputMode: 'numeric',
                        value: {reps}
                    }}
                    labelText='Reps'
                    defaultValue='8'
                />
            </div>
            <div className='weight'>
                <SetInputField
                    inputProps={{
                        name: 'weight-input',
                        type: 'number',
                        onChange: ev => setWeight(ev.target.value),
                        pattern: '\d+',
                        min: '0',
                        inputMode: 'numeric',
                        value: {weight}
                    }}
                    labelText='Weight'
                    defaultValue='10'
                />
            </div>
            <div className='rest'>
                <SetInputField
                    inputProps={{
                        name: 'rest-input',
                        type: 'number',
                        onChange: ev => setRestTime(ev.target.value),
                        pattern: '\d+',
                        min: '0',
                        inputMode: 'numeric',
                        value: {restTime}
                    }}
                    labelText='Rest'
                    defaultValue={defaultRestTime}
                />
            </div>
        </div>
    )
}