import { useState } from "react";
import ExerciseSetDisplay from "./components/ExerciseSetDisplay";

function App() {
    return (
<ExerciseSetDisplay
    targetReps={10}
    targetWeight={5}
    targetRest={3750}
    />
    );
}

export default App;
