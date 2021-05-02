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
            tabIndex={0}
            onFocus={() => isEdit || onToggleEdit(true)}
        >
            <span>{labelText}</span>
            {
                isEdit ? (
                    <input
                        {...inputProps}
                        value={value}
                        autoFocus
                        onBlur={() => isEdit && onToggleEdit(false)}
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
                setDurationTime((t) => Number(t) + 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (stage === 'IDLE') {
            setDurationTime(0);
        }
    }, [stage, isEditTime]);

    useEffect(() => {
        if (stage === 'RESTING' && !isEditRest) {
            const interval = setInterval(() => {
                setRestTime((t) => Number(t) - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (stage === 'IDLE') {
            setRestTime(defaultRestTime);
        }
    }, [stage, defaultRestTime, isEditRest]);

    useEffect(() => {
        if (stage === 'COMPLETE' && restTime < 0) {
            setRestTime(r => defaultRestTime - r);
        }
    }, [stage, defaultRestTime, restTime]);

    const numericInputProps = {
        type: 'number',
        pattern: '\\d+',
        min: '0',
        inputMode: 'numeric',
    }

    return (
        <div>
            <div className='time'>
                <SetInputField
                    inputProps={numericInputProps}
                    isEdit={isEditTime}
                    onToggleEdit={setIsEditTime}
                    onChange={setDurationTime}
                    value={durationTime}
                    formatFunction={timeFormat}
                    labelText='Time'
                    defaultValue='0'
                />
            </div>
            <div className='reps'>
                <SetInputField
                    inputProps={numericInputProps}
                    isEdit={isEditReps}
                    onToggleEdit={setIsEditReps}
                    onChange={setReps}
                    value={reps}
                    formatFunction={timeFormat}
                    labelText='Reps'
                    defaultValue='8'
                />
            </div>
            <div className='weight'>
                <SetInputField
                    inputProps={numericInputProps}
                    isEdit={isEditWeight}
                    onToggleEdit={setIsEditWeight}
                    onChange={setWeight}
                    value={weight}
                    formatFunction={timeFormat}
                    labelText='Weight'
                    defaultValue='10'
                />
            </div>
            <div className='rest'>
                <SetInputField
                    inputProps={numericInputProps}
                    isEdit={isEditRest}
                    onToggleEdit={setIsEditRest}
                    onChange={setRestTime}
                    value={restTime}
                    formatFunction={timeFormat}
                    labelText='Rest'
                    defaultValue={defaultRestTime}
                />
            </div>
        </div>
    )
}