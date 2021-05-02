import { useState } from "react";
import SetDisplay from "./components/SetDisplay";

function getNextStageFor(stage) {
    const stages = ['IDLE', 'ACTIVE', 'RESTING', 'COMPLETE'];
    const index = stages.findIndex(stage);

    return stages[(index + 1) % stages.length];
}

function App() {
    const [stages, setStages] = useState(['IDLE', 'IDLE', 'IDLE']);

    const updateStage = (index, newStage = null) => {
        if (!newStage) {
            newStage = getNextStageFor(stages[index]);
        }
        const stagesList = stages.slice();
        stagesList.splice(index, 1, newStage);
        setStages(stagesList);
    }

    return (
        <div>
            <ul>
                {stages.map((set, index) =>
                    <SetDisplay
                        defaultRestTime={90}
                        defaultReps={8}
                        defaultWeight={10}
                        onReset={() => updateStage(index, 'IDLE')}
                        stage={stages[index]}
                    ></SetDisplay>
                )}
            </ul>
            <button onClick={updateStage}>Next stage</button>
        </div>
    );
}

export default App;
