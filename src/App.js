import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Workout from './components/Workout';
import WorkoutHistory from './components/WorkoutHistory';
import WorkoutList from './components/WorkoutList';

import { Container } from './ui';

function App() {
    const renderWorkout = (routeProps) => {
        let id = new URLSearchParams(routeProps.location.search).get('id');

        const createNew = routeProps.match.path === '/newWorkout';

        if (routeProps.match.path === '/viewWorkout') {
            id = Number(id); // Logs have numeric ids
        }

        return <Workout id={id} createNew={createNew} />;
    };

    return (
        <Container>
            <Router basename={process.env.PUBLIC_URL}>
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
