import { BiChevronDown, BiChevronUp, BiDumbbell } from 'react-icons/bi';

import SetDisplay from './SetDisplay';
import RPEScale from './RPEScale';

import '../range.css';
import { useTranslation } from 'react-i18next';


export default function Exercise(props) {
    const {
        id,
        name,
        sets,
        isFirst = false,
        isLast = false,
        isActive = false,
        isComplete = false,
        isReadOnly=false,
        isWorkoutComplete = false,
        activeSetId = null,
        dispatch = () => {},
    } = props;

    const { t } = useTranslation();

    const onRemoveSet = () => {
        dispatch({
            type: 'REMOVE_SET',
            payload: {
                exerciseId: id
            }
        });
    };

    const onAddSet = () => {
        dispatch({
            type: 'ADD_SET',
            payload: {
                exerciseId: id
            }
        });
    };

    const onActivateSet = (setId) => {
        dispatch({
            type: 'UPDATE_ACTIVE_SET',
            payload: {
                exerciseId: id,
                setId
            }
        });
    };

    const moveExercise = (factor) => {
        dispatch({
            type: 'MOVE_EXERCISE',
            payload: {
                exerciseId: id,
                factor
            }
        });
    };

    return (
        <div className='exercise relative' data-id={id}>
            {isWorkoutComplete || isReadOnly || (
                <div className='absolute top-1 right-1 text-indigo-500'>
                    <button disabled={isLast} onClick={() => moveExercise(1)} className='disabled:opacity-50 p-2'><BiChevronDown /></button>
                    <button disabled={isFirst} onClick={() => moveExercise(-1)} className='disabled:opacity-50 p-2'><BiChevronUp /></button>
                </div>
            )}
            <ul className={`p-2 border border-indigo-200 flex flex-col space-y-3 bg-indigo-50 rounded-xl ${isActive ? 'ring-2 ring-indigo-200' : ''}`}>
                <h3 className='exercise-name text-lg font-semibold text-indigo-800 -mb-1'>
                    <BiDumbbell className='inline text-xl mb-1'/> {name}
                </h3>
                {sets.length ? sets.map((set) =>
                    <SetDisplay
                        key={set.id}
                        id={set.id}
                        exerciseId={id}
                        defaultDurationTime={set.defaultDurationTime}
                        defaultWeight={set.defaultWeight}
                        defaultRestTime={set.defaultRestTime}
                        defaultReps={set.defaultReps}
                        onClick={() => onActivateSet(set.id)}
                        onActivateSet={onActivateSet}
                        isActive={set.id === activeSetId}
                        isReadOnly={isReadOnly}
                        stage={set.stage}
                        dispatch={dispatch}
                    ></SetDisplay>
                ) : (
                    <p className='text-indigo-500 text-sm pb-1'>{t('no_sets')}</p>
                )}
                {isComplete && sets.length > 0 && <RPEScale isReadOnly={isReadOnly} />}
            </ul>
            {isWorkoutComplete || isReadOnly || (
                <div className='flex justify-end mt-1'>
                    {isActive && activeSetId !== null && <button onClick={onRemoveSet} className='text-blue-500 text-sm px-1 mr-4'>{t('remove_set')}</button>}
                    <button onClick={onAddSet} className='text-blue-500 text-sm px-1'>{t('add_set')}</button>
                </div>
            )}
        </div>
    );
}