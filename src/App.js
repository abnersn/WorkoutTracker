import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Workout from './components/Workout';
import WorkoutHistory from './components/WorkoutHistory';
import WorkoutList from './components/WorkoutList';

import { loadWorkoutById } from './util/workoutPersistence';

import './i18n';
import { Container } from './ui';

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
    const renderWorkout = (routeProps) => {
        const id = new URLSearchParams(routeProps.location.search).get('id');

        const createNew = routeProps.match.path === '/newWorkout';
        const workout = loadWorkoutById(id, createNew);
        console.log(workout);

        return <Workout baseWorkout={workout} readOnly={!createNew} />;
    };
    return (
        <Suspense fallback={<Loading />}>
            <Container>
                <Router>
                    <Switch>
                        <Route exact path='/'>
                            <WorkoutList />
                            <WorkoutHistory />
                        </Route>
                        <Route path='/viewWorkout' render={renderWorkout} />
                        <Route path='/newWorkout' render={renderWorkout} />
                    </Switch>
                </Router>
            </Container>
        </Suspense>
    );
}

export default App;
