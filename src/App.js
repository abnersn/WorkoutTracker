import { useState } from "react";
import SetDisplay from "./components/SetDisplay";
import { BiCheck, BiDumbbell, BiPause, BiPlay, BiSkipNext, BiTrophy } from "react-icons/bi";

function getNextStageFor(stage) {
    const stages = ['IDLE', 'ACTIVE', 'RESTING', 'COMPLETE'];
    const index = stages.findIndex(s => s === stage);

    return stages[(index + 1) % stages.length];
}

function CycleButton({ stage, onClick = () => {} }) {
    const labels = {
        IDLE: 'Start',
        ACTIVE: 'Rest',
        RESTING: 'Complete',
        COMPLETE: 'Next'
    }

    const icons = {
        IDLE: BiPlay,
        ACTIVE: BiPause,
        RESTING: BiCheck,
        COMPLETE: BiSkipNext
    }

    const colors = {
        IDLE: 'indigo',
        ACTIVE: 'indigo',
        RESTING: 'indigo',
        COMPLETE: 'blue'
    }

    const label = labels[stage];
    const Icon = icons[stage];
    const color = colors[stage];

    return (
        <button
            className={`btn bg-${color}-500 border-${color}-600 focus:ring-${color}-200 active:bg-${color}-700`}
            onClick={onClick}>
            {<Icon stage={stage} className='mr-1 text-lg' />}{label}
        </button>
    )
}

function CompleteExerciseButton({ onClickCompleteExercise = () => {} }) {
    const color = 'green';
    return (
        <button
            className={`btn bg-${color}-500 border-${color}-600 focus:ring-${color}-200 active:bg-${color}-700`}
            onClick={onClickCompleteExercise}>
            <BiTrophy className='mr-1 text-lg' /> Finish
        </button>
    )
}

function App() {
    const [stages, setStages] = useState(['IDLE', 'IDLE', 'IDLE']);
    const [activeSet, setActiveSet] = useState(null);

    const updateStage = (index, newStage = null) => {
        if (!newStage) {
            newStage = getNextStageFor(stages[index]);
        }
        const stagesList = stages.slice();
        stagesList.splice(index, 1, newStage);
        setStages(stagesList);
    }

    const exerciseName = 'Exercise 3';

    const onFooterButtonClick = () => {
        const stage = stages[activeSet];
        if (stage === 'COMPLETE') {
            // Move to next set
            if (activeSet < stages.length) {
                setActiveSet(activeSet + 1);
            } else {
                setActiveSet(null);
            }
        } else {
            updateStage(activeSet);
        }
    }

    const addNewSet = () => {
        setStages([...stages, 'IDLE']);
    }

    const removeSet = () => {
        if (!Number.isFinite(activeSet)) {
            return;
        }
        setStages(stages.filter((_, i) => i !== activeSet));
        setActiveSet(activeSet < stages.length ? activeSet : null);
    }

    let footerButton = null;
    if (!stages.some(s => s !== 'COMPLETE')) {
        footerButton = <CompleteExerciseButton />;
    } else if (activeSet !== null) {
        footerButton = <CycleButton
            stage={stages[activeSet]}
            onClick={onFooterButtonClick}
        />;
    }

    return (
        <div className='bg-white p-2'>
            <div>
                <ul className='p-2 border border-indigo-200 flex flex-col space-y-3 bg-indigo-50 rounded-xl'>
                    <h3 className='text-lg font-semibold text-indigo-800 -mb-1'>
                        <BiDumbbell className='inline text-xl mb-1'/> {exerciseName}
                    </h3>
                    {stages.map((stage, index) =>
                        <SetDisplay
                            key={index}
                            defaultRestTime={90}
                            defaultReps={8}
                            onClick={() => setActiveSet(index)}
                            defaultWeight={10}
                            isActive={index === activeSet}
                            onReset={() => updateStage(index, 'IDLE')}
                            onComplete={() => setActiveSet((index + 1) % stages.length)}
                            stage={stage}
                        ></SetDisplay>
                    )}
                </ul>
                <div className='flex justify-end mt-1'>
                    <button onClick={removeSet} className='text-blue-500 text-sm px-1 mr-4'>Remove set</button>
                    <button onClick={addNewSet} className='text-blue-500 text-sm px-1'>Add set</button>
                </div>
            </div>
            <div className='flex fixed items-center border-t border-indigo-200 bottom-0 bg-white w-full left-0 p-3'>
                <h3 className='text-lg font-semibold text-indigo-800 -mb-1'>
                    {exerciseName}
                </h3>
                {footerButton}
            </div>
        </div>
    );
}

export default App;
