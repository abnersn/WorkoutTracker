import { BiDumbbell } from "react-icons/bi";

import SetDisplay from "./SetDisplay";

export default function Exercise(props) {
    const {
        name,
        sets,
        activeSet = null,
        onClickSet = () => {},
        onRemoveSet = () => {},
        onAddSet = () => {},
    } = props;

    const isActive = sets.some(s => s.id === activeSet);

    return (
        <div>
            <ul className='p-2 border border-indigo-200 flex flex-col space-y-3 bg-indigo-50 rounded-xl'>
                <h3 className='text-lg font-semibold text-indigo-800 -mb-1'>
                    <BiDumbbell className='inline text-xl mb-1'/> {name}
                </h3>
                {sets.length ? sets.map((set) =>
                    <SetDisplay
                        key={set.id}
                        defaultRestTime={90}
                        defaultReps={8}
                        onClick={() => onClickSet(set)}
                        defaultWeight={10}
                        isActive={set === activeSet}
                        stage={set.stage}
                    ></SetDisplay>
                ) : (
                    <p className='text-indigo-500 text-sm pb-1'>No sets for this exercise.</p>
                )}
            </ul>
            <div className='flex justify-end mt-1'>
                {sets.length > 0 && <button onClick={onRemoveSet} className='text-blue-500 text-sm px-1 mr-4'>Remove set</button>}
                <button onClick={onAddSet} className='text-blue-500 text-sm px-1'>Add set</button>
            </div>
        </div>
    );
}