import SetDisplay from "./components/SetDisplay";

function App() {
    return (
        <div>
            <SetDisplay
                defaultRestTime={90}
                defaultReps={8}
                defaultWeight={10}
                stage = 'ACTIVE'
            ></SetDisplay>
        </div>
    );
}

export default App;
