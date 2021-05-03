import { useState } from "react";
import SetDisplay from "./components/SetDisplay";
import { BiCheck, BiDumbbell, BiPause, BiPlay, BiTrash } from "react-icons/bi";

function getNextStageFor(stage) {
    const stages = ['IDLE', 'ACTIVE', 'RESTING', 'COMPLETE'];
    const index = stages.findIndex(s => s === stage);

    return stages[(index + 1) % stages.length];
}

function FooterButton({ stage, onClick = () => {} }) {
    const labels = {
        IDLE: 'Start',
        ACTIVE: 'Rest',
        RESTING: 'Complete',
        COMPLETE: 'Clear'
    }

    const icons = {
        IDLE: BiPlay,
        ACTIVE: BiPause,
        RESTING: BiCheck,
        COMPLETE: BiTrash
    }

    const colors = {
        IDLE: 'indigo',
        ACTIVE: 'blue',
        RESTING: 'green',
        COMPLETE: 'red'
    }

    const label = labels[stage];
    const Icon = icons[stage];
    const color = colors[stage];

    return (
        <button
            className={`bg-${color}-500 flex uppercase focus:ring-4 focus:ring-${color}-200 active:bg-${color}-700 text-sm items-center text-white px-3 py-2 rounded-md`}
            onClick={onClick}>
            {<Icon stage={stage} className='mr-1 text-lg' />}{label}
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

    return (
        <div className='bg-white p-2'>
            <ul className='p-2 border border-indigo-200 flex flex-col space-y-3 bg-indigo-50 rounded-xl m-3'>
                <h3 className='text-lg font-semibold text-indigo-800 -mb-1'>
                    <BiDumbbell className='inline text-xl mb-1'/> Exercise 3
                </h3>
                {stages.map((set, index) =>
                    <SetDisplay
                        key={index}
                        defaultRestTime={90}
                        defaultReps={8}
                        onClick={() => setActiveSet(index)}
                        defaultWeight={10}
                        isActive={index === activeSet}
                        onReset={() => updateStage(index, 'IDLE')}
                        stage={stages[index]}
                    ></SetDisplay>
                )}
            </ul>
            {activeSet !== null && <FooterButton stage={stages[activeSet]} onClick={() => updateStage(activeSet)} />}
        </div>
    );
}

export default App;
