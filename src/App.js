import { Suspense } from 'react';
import Workout from './components/Workout';

import './i18n';

function App() {
    return (
        <Suspense fallback={<p>Loading...</p>}><Workout /></Suspense>
    );
}

export default App;
