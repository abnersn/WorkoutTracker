import { Suspense } from 'react';
import Workout from './components/Workout';

import './i18n';

function Loading() {
    return(
        <div className='bg-white p-2 m-3 rounded-lg shadow max-w-md mx-auto'>
            Loading...
        </div>
    );
}

function App() {
    return (
        <Suspense fallback={<Loading />}><Workout /></Suspense>
    );
}

export default App;
