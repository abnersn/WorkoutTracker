import { BiChevronDown, BiChevronUp, BiDumbbell } from 'react-icons/bi';

import SetDisplay from './SetDisplay';
import RPEScale from './RPEScale';

import '../range.css';
import useTranslation from '../hooks/useTranslation';
import {
    Block,
    EmptyMessage,
    List,
    TitleH3,
    LightButton,
    BlockActions
} from '../ui';

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
        defaultRPE=5,
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
                    <button
                        disabled={isLast}
                        onClick={() => moveExercise(1)}
                        className='disabled:opacity-50 p-2'
                    ><BiChevronDown /></button>
                    <button
                        disabled={isFirst}
                        onClick={() => moveExercise(-1)}
                        className='disabled:opacity-50 p-2'
                    ><BiChevronUp /></button>
                </div>
            )}
            <Block isActive={isActive}>
                <List>
                    <TitleH3 className='exercise-name'>
                        <BiDumbbell className='inline text-xl mb-1'/> {name}
                    </TitleH3>
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
                        <EmptyMessage>{t('no_sets')}</EmptyMessage>
                    )}
                    {
                        isComplete && sets.length > 0 &&
                        <RPEScale
                            defaultRPE={defaultRPE}
                            isReadOnly={isReadOnly}
                        />
                    }
                </List>
            </Block>
            {isWorkoutComplete || isReadOnly || (
                <BlockActions>
                    {
                        isActive && activeSetId !== null &&
                        <LightButton onClick={onRemoveSet}>
                            {t('remove_set')}
                        </LightButton>
                    }
                    <LightButton onClick={onAddSet}>{t('add_set')}</LightButton>
                </BlockActions>
            )}
        </div>
    );
}