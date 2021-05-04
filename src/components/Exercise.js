import { BiDumbbell } from "react-icons/bi";

import SetDisplay from "./SetDisplay";

export default function Exercise(props) {
    const {
        id,
        name,
        sets,
        isActive = false,
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

    return (
        <div>
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
            </ul>
            <div className='flex justify-end mt-1'>
                {isActive && activeSetId !== null && <button onClick={onRemoveSet} className='text-blue-500 text-sm px-1 mr-4'>Remove set</button>}
                <button onClick={onAddSet} className='text-blue-500 text-sm px-1'>Add set</button>
            </div>
        </div>
    );
}