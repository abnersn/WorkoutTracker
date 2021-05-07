import { useEffect, useRef, useState } from 'react';
import timeFormat from '../util/timeFormat';
import { useTranslation } from 'react-i18next';
import { ListItem, TextLabel } from '../ui';

function SetInputField(props) {
    const {
        inputProps,
        labelText,
        value = null,
        formatFunction = val => val,
        color = 'indigo',
        isEdit = false,
        onToggleEdit = () => {},
        onChange = () => {}
    } = props;

    return (
        <label className={`text-${color}-800`}>
            <TextLabel className='mb-1'>{labelText}</TextLabel>
            {
                isEdit ? (
                    <input
                        {...inputProps}
                        className={`block text-${color}-800 tabuler-nums w-full px-1 bg-${color}-50 rounded shadow-sm border border-${color}-200 focus:ring-2 focus:ring-${color}-100`}
                        value={value}
                        autoFocus
                        onFocus={ev => ev.target.select()}
                        onBlur={() => isEdit && onToggleEdit(false)}
                        onChange={ev => onChange(Number(ev.target.value))}
                    ></input>
                ) : (
                    <span data-value={value} tabIndex={0} onFocus={() => isEdit || onToggleEdit(true)} className={`value block text-${color}-800 tabuler-nums w-full px-1 bg-${color}-50 rounded shadow-sm border border-${color}-200`}>
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

    const baseColor = stage === 'COMPLETE' ? 'green' : 'indigo';
    const highlightColor = 'cyan';

    const getRestingColor = () => {
        if (stage === 'RESTING') {
            return restTime < 0 ? 'red' : highlightColor;
        }
        return baseColor;
    };

    return (
        <ListItem
            onClick={onClick}
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
                    color={stage === 'ACTIVE' ? highlightColor : baseColor}
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
                    color={baseColor}
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
                    color={baseColor}
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
                    color={getRestingColor()}
                    formatFunction={timeFormat}
                    labelText={t('rest')}
                    defaultValue={defaultRestTime}
                />
            </div>
        </ListItem>
    );
}