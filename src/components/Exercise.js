import { BiChevronDown, BiChevronUp, BiDumbbell } from "react-icons/bi";

import SetDisplay from "./SetDisplay";
import RPEScale from "./RPEScale";

import '../range.css';


export default function Exercise(props) {
    const {
        id,
        name,
        sets,
        isFirst = false,
        isLast = false,
        isActive = false,
        isComplete = false,
        isWorkoutComplete = false,
        activeSetId = null,
        dispatch = () => {},
    } = props;

    const onRemoveSet = () => {
        dispatch({
            type: 'REMOVE_SET',
            payload: {
                exerciseId: id
            }
        })
    }

    const onAddSet = () => {
        dispatch({
            type: 'ADD_SET',
            payload: {
                exerciseId: id
            }
        })
    }

    const onActivateSet = (setId) => {
        dispatch({
            type: 'UPDATE_ACTIVE_SET',
            payload: {
                exerciseId: id,
                setId
            }
        })
    }

    const moveExercise = (factor) => {
        dispatch({
            type: 'MOVE_EXERCISE',
            payload: {
                exerciseId: id,
                factor
            }
        })
    }

    return (
        <div className='relative'>
            {isWorkoutComplete || (
                <div className='absolute top-1 right-1 text-indigo-500'>
                    <button disabled={isLast} onClick={() => moveExercise(1)} className='disabled:opacity-50 p-2'><BiChevronDown /></button>
                    <button disabled={isFirst} onClick={() => moveExercise(-1)} className='disabled:opacity-50 p-2'><BiChevronUp /></button>
                </div>
            )}
            <ul className={`p-2 border border-indigo-200 flex flex-col space-y-3 bg-indigo-50 rounded-xl ${isActive ? 'ring-2 ring-indigo-200' : ''}`}>
                <h3 className='text-lg font-semibold text-indigo-800 -mb-1'>
                    <BiDumbbell className='inline text-xl mb-1'/> {name}
                </h3>
                {sets.length ? sets.map((set) =>
                    <SetDisplay
                        key={set.id}
                        id={set.id}
                        exerciseId={id}
                        defaultRestTime={90}
                        defaultReps={8}
                        onClick={() => onActivateSet(set.id)}
                        onActivateSet={onActivateSet}
                        defaultWeight={10}
                        isActive={set.id === activeSetId}
                        stage={set.stage}
                        dispatch={dispatch}
                    ></SetDisplay>
                ) : (
                    <p className='text-indigo-500 text-sm pb-1'>No sets for this exercise.</p>
                )}
                {isComplete && sets.length > 0 && <RPEScale />}
            </ul>
            {isWorkoutComplete || (
                <div className='flex justify-end mt-1'>
                    {isActive && activeSetId !== null && <button onClick={onRemoveSet} className='text-blue-500 text-sm px-1 mr-4'>Remove set</button>}
                    <button onClick={onAddSet} className='text-blue-500 text-sm px-1'>Add set</button>
                </div>
            )}
        </div>
    );
}