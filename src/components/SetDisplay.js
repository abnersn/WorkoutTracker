import { useEffect, useRef, useState } from 'react';
import timeFormat from '../util/timeFormat';
import useTranslation from '../hooks/useTranslation';
import { ListItem, TextLabel } from '../ui';

function SetInputField(props) {
    const {
        inputProps,
        labelText,
        value = null,
        formatFunction = val => val,
        type = 'neutral',
        isEdit = false,
        onToggleEdit = () => {},
        onChange = () => {}
    } = props;

    const labelColorClass = {
        primary: 'text-blue-800',
        neutral: 'text-indigo-800',
        success: 'text-green-800',
        danger: 'text-red-800',
        highlight: 'text-cyan-800'
    };
    
    const inputColorClass = {
        primary: 'text-blue-800 bg-blue-50 border-blue-200 focus:ring-blue-100',
        neutral: 'text-indigo-800 bg-indigo-50 border-indigo-200 focus:ring-indigo-100',
        success: 'text-green-800 bg-green-50 border-green-200 focus:ring-green-100',
        danger: 'text-red-800 bg-red-50 border-red-200 focus:ring-red-100',
        highlight: 'text-cyan-800 bg-cyan-50 border-cyan-200 focus:ring-cyan-100'
    };

    return (
        <label className={labelColorClass[type]}>
            <TextLabel className='mb-1'>{labelText}</TextLabel>
            {
                isEdit ? (
                    <input
                        {...inputProps}
                        className={`block tabuler-nums w-full px-1 rounded shadow-sm border focus:ring-2 ${inputColorClass[type]}`}
                        value={value}
                        autoFocus
                        onFocus={ev => ev.target.select()}
                        onBlur={() => isEdit && onToggleEdit(false)}
                        onChange={ev => onChange(Number(ev.target.value))}
                    ></input>
                ) : (
                    <span data-value={value} tabIndex={0} onFocus={() => isEdit || onToggleEdit(true)} className={`value block tabuler-nums w-full px-1 rounded shadow-sm border ${inputColorClass[type]}`}>
                        {formatFunction(Number(value))}
                    </span>
                )
            }
        </label>
    );
}

export default function SetDisplay(props) {
    const {
        id,
        exerciseId,
        defaultDurationTime = 0,
        defaultRestTime = 30,
        defaultReps = 8,
        defaultWeight = 10,
        isReadOnly = false,
        onClick = () => {},
        dispatch = () => {},
        isActive = true,
        stage = 'IDLE'
    } = props;

    const [durationTime, setDurationTime] = useState(defaultDurationTime);
    const [restTime, setRestTime] = useState(defaultRestTime);
    const [reps, setReps] = useState(defaultReps);
    const [weight, setWeight] = useState(defaultWeight);

    const [isEditTime, setIsEditTime] = useState(false);
    const [isEditReps, setIsEditReps] = useState(false);
    const [isEditWeight, setIsEditWeight] = useState(false);
    const [isEditRest, setIsEditRest] = useState(false);

    const prevStageRef = useRef();

    const { t } = useTranslation();
    useEffect(() => {
        if (isEditTime || isEditReps || isEditWeight || isEditRest) {
            dispatch({
                type: 'UPDATE_ACTIVE_SET',
                payload: {
                    setId: id,
                    exerciseId
                }
            });

        }
    }, [
        dispatch, isEditTime, isEditReps, isEditRest,
        isEditWeight, id, exerciseId
    ]);

    useEffect(() => {
        if (stage === 'IDLE' && prevStageRef.current === 'COMPLETE') {
            setDurationTime(0);
            setRestTime(defaultRestTime);
            setReps(defaultReps);
            setWeight(defaultWeight);
        }
    }, [defaultRestTime, defaultReps, defaultWeight, stage]);

    useEffect(() => {
        prevStageRef.current = stage;        
    }, [stage]);

    useEffect(() => {
        if (stage === 'ACTIVE' && !isEditTime) {
            const interval = setInterval(() => {
                setDurationTime((t) => Number(t) + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [stage, isEditTime]);

    useEffect(() => {
        if (stage === 'RESTING' && !isEditRest) {
            const interval = setInterval(() => {
                setRestTime((t) => Number(t) - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [stage, defaultRestTime, isEditRest]);

    const numericInputProps = {
        type: 'number',
        pattern: '\\d+',
        min: '0',
        inputMode: 'numeric',
    };

    const baseType = stage === 'COMPLETE' ? 'success' : 'neutral';

    const getRestingType = () => {
        if (stage === 'RESTING') {
            return restTime < 0 ? 'danger' : 'highlight';
        }
        return baseType;
    };

    return (
        <ListItem
            onClick={onClick}
            data-id={id}
            className='set-display flex space-x-2'
            isActive={isActive && !isReadOnly}
        >
            <div className='time flex-1'>
                <SetInputField
                    inputProps={numericInputProps}
                    isEdit={isEditTime && !isReadOnly}
                    onToggleEdit={setIsEditTime}
                    onChange={setDurationTime}
                    value={durationTime}
                    formatFunction={timeFormat}
                    type={stage === 'ACTIVE' ? 'highlight' : baseType}
                    labelText={t('time')}
                    defaultValue='0'
                />
            </div>
            <div className='reps flex-1'>
                <SetInputField
                    inputProps={numericInputProps}
                    isEdit={isEditReps && !isReadOnly}
                    onToggleEdit={setIsEditReps}
                    onChange={setReps}
                    value={reps}
                    type={baseType}
                    labelText={t('reps')}
                    defaultValue='8'
                />
            </div>
            <div className='weight flex-1'>
                <SetInputField
                    inputProps={numericInputProps}
                    isEdit={isEditWeight && !isReadOnly}
                    onToggleEdit={setIsEditWeight}
                    onChange={setWeight}
                    value={weight}
                    type={baseType}
                    labelText={t('weight')}
                    defaultValue='10'
                />
            </div>
            <div className='rest flex-1'>
                <SetInputField
                    inputProps={numericInputProps}
                    isEdit={isEditRest && !isReadOnly}
                    onToggleEdit={setIsEditRest}
                    onChange={setRestTime}
                    value={restTime}
                    type={getRestingType()}
                    formatFunction={timeFormat}
                    labelText={t('rest')}
                    defaultValue={defaultRestTime}
                />
            </div>
        </ListItem>
    );
}