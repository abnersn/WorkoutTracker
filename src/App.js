import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Workout from './components/Workout';
import WorkoutHistory from './components/WorkoutHistory';
import WorkoutList from './components/WorkoutList';

import { loadWorkoutById } from './util/workoutPersistence';

import { Container } from './ui';

function App() {
    const renderWorkout = (routeProps) => {
        const id = new URLSearchParams(routeProps.location.search).get('id');

        const createNew = routeProps.match.path === '/newWorkout';
        const workout = loadWorkoutById(id, createNew);
        console.log(workout);

        return <Workout baseWorkout={workout} readOnly={!createNew} />;
    };
    return (
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
    );
}

export default App;
