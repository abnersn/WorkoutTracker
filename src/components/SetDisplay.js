import { useEffect, useState } from "react";
import timeFormat from "../util/timeFormat";

function SetInputField(props) {
    const {
        inputProps,
        labelText,
        isEdit = false,
        value = null,
        formatFunction = val => val,
        onToggleEdit = () => {},
        onChange = () => {}
    } = props;

    return (
        <label
            onFocus={() => onToggleEdit(true)}
            onBlur={() => onToggleEdit(false)}
        >
            <span>{labelText}</span>
            {
                isEdit ? (
                    <input
                        {...inputProps}
                        value={value}
                        onChange={ev => onChange(ev.target.value)}
                    ></input>
                ) : (
                    <span className='value'>
                        {formatFunction(value)}
                    </span>
                )
            }
        </label>
    )
}

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

    const [isEditTime, setIsEditTime] = useState(false);
    const [isEditReps, setIsEditReps] = useState(false);
    const [isEditWeight, setIsEditWeight] = useState(false);
    const [isEditRest, setIsEditRest] = useState(false);

    useEffect(() => {
        if (stage === 'ACTIVE' && !isEditTime) {
            const interval = setInterval(() => {
                setDurationTime((t) => t + 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (stage === 'IDLE') {
            setDurationTime(0);
        }
    }, [stage, isEditTime]);

    useEffect(() => {
        if (stage === 'RESTING' && !isEditRest) {
            const interval = setInterval(() => {
                setRestTime((t) => t - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (stage === 'IDLE') {
            setRestTime(defaultRestTime);
        }
    }, [stage, defaultRestTime, isEditRest]);

    return (
        <div>
            <div className='time'>
                <SetInputField
                    inputProps={{
                        name: 'time-input',
                        type: 'number',
                        pattern: '\\d+',
                        min: '0',
                        inputMode: 'numeric',
                        isEdit: isEditTime,
                        onToggleEdit: setIsEditTime,
                        value: durationTime,
                        onChange: setDurationTime
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
                        pattern: '\\d+',
                        min: '0',
                        inputMode: 'numeric',
                        isEdit: isEditReps,
                        onToggleEdit: setIsEditReps,
                        value: reps,
                        onChange: setReps
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
                        pattern: '\\d+',
                        min: '0',
                        inputMode: 'numeric',
                        isEdit: isEditWeight,
                        onToggleEdit: setIsEditWeight,
                        value: weight,
                        onChange: setWeight
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
                        pattern: '\\d+',
                        min: '0',
                        inputMode: 'numeric',
                        isEdit: isEditRest,
                        onToggleEdit: setIsEditRest,
                        value: restTime,
                        onChange: setRestTime
                    }}
                    labelText='Rest'
                    defaultValue={defaultRestTime}
                />
            </div>
        </div>
    )
}