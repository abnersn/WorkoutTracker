import { Suspense } from 'react';
import Workout from './components/Workout';

import './i18n';
import { loadWorkout } from './util/workoutPersistence';

function Loading() {
    return(
        <div className='bg-white p-2 m-3 rounded-lg shadow max-w-md mx-auto'>
            Loading...
        </div>
    );
}

function App() {
    const savedWorkout = loadWorkout('2021-05-06_379a0881');

    return (
        <Suspense fallback={<Loading />}><Workout savedWorkout={savedWorkout} /></Suspense>
    );
}

export default App;
