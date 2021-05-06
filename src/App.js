import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Workout from './components/Workout';
import WorkoutList from './components/WorkoutList';

import './i18n';

function Loading() {
    return(
        <div className='p-2'>
            <p className='bg-white p-2 m-3 rounded-lg shadow max-w-md mx-auto'>
               Loading...
            </p>
        </div>
    );
}

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <WorkoutList />
                    </Route>
                    <Route path='/workout/new' component={Workout} />
                </Switch>
            </Router>
        </Suspense>
    );
}

export default App;
