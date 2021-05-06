import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AddWorkout from './components/AddWorkout';
import Workout from './components/Workout';

import './i18n';
import genHash from './util/genHash';
import { addWorkoutToList, loadWorkout, removeWorkoutFromList } from './util/workoutPersistence';

function Loading() {
    return(
        <div className='bg-white p-2 m-3 rounded-lg shadow max-w-md mx-auto'>
            Loading...
        </div>
    );
}

function WorkoutDisplay() {
    return (<div></div>);
}

function WorkoutList() {
    const { t } = useTranslation();
    const [workouts, setWorkouts] = useState([]);

    const onAddWorkout = (name) => {
        const workout = {
            id: genHash(), name, exercises: []
        };
        addWorkoutToList(workout);
        setWorkouts(workouts.concat(workouts, [workout]));
    };

    const onRemoveWorkout = (id) => {
        removeWorkoutFromList(id);
        setWorkouts(workouts.filter(w => w.id !== id));
    };

    return (
        <div className='bg-white max-w-5xl min-h-screen m-auto border shadow-md place-self-center'>
            <h2 className='workout-name text-2xl text-indigo-800 font-semibold px-3 pt-4'>
                {t('workouts_list')}
            </h2>
            {
                workouts.length > 0 ? (
                    <ul className='flex flex-col space-y-4 p-3'>
                        {
                            workouts.map((workout) =>
                                <WorkoutDisplay
                                    key={workout.id}
                                    id={workout.id}
                                    name={workout.name}
                                    onRemoveWorkout={onRemoveWorkout}
                                />)
                        }
                    </ul>
                ) : (
                    <p className='px-3 my-2 text-indigo-500'>{t('no_workout')}</p>
                )
            }
            <AddWorkout onAddWorkout={onAddWorkout} />
        </div>
    );
}

function App() {
    const savedWorkout = loadWorkout('2021-05-06_379a0881');

    return (
        <Suspense fallback={<Loading />}>
            <Router>
                <Switch>
                    <Route path='/'>
                        <WorkoutList />
                    </Route>
                    <Route path='/workout'>
                        <Workout savedWorkout={savedWorkout} />
                    </Route>
                </Switch>
            </Router>
        </Suspense>
    );
}

export default App;
