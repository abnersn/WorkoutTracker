import { useState } from "react";
import SetDisplay from "./components/SetDisplay";

const STAGES = ['IDLE', 'ACTIVE', 'RESTING', 'COMPLETE'];

function App() {
    const [stageIndex, setStageIndex] = useState(0);

    const updateStage = () => {
        setStageIndex(s => (s + 1) % STAGES.length);
    }

    return (
        <div>
            {STAGES[stageIndex]}
            <SetDisplay
                defaultRestTime={90}
                defaultReps={8}
                defaultWeight={10}
                onReset={() => setStageIndex(0)}
                stage={STAGES[stageIndex]}
            ></SetDisplay>
            <button onClick={updateStage}>Next stage</button>
        </div>
    );
}

export default App;
