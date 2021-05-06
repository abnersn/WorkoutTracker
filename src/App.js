import { formatDistance } from 'date-fns';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiDumbbell, BiTrash } from 'react-icons/bi';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import AddWorkout from './components/AddWorkout';
import Workout from './components/Workout';

import './i18n';
import genHash from './util/genHash';
import { addWorkoutToList, getLastRunDate, getWorkoutList, removeWorkoutFromList } from './util/workoutPersistence';

function Loading() {
    return(
        <div className='p-2'>
            <p className='bg-white p-2 m-3 rounded-lg shadow max-w-md mx-auto'>
               Loading...
            </p>
        </div>
    );
}

function WorkoutDisplay(props) {
    const { name, onRemoveWorkout, id } = props;

    const lastRun = getLastRunDate(id);

    return (
        <div className='p-2 border border-indigo-200 relative flex flex-wrap bg-indigo-50 rounded-xl'>
            <button onClick={() => onRemoveWorkout(id)} className='absolute top-2 right-2 text-indigo-400'><BiTrash /></button>
            <h2 className='text-indigo-700 w-full text-md'><BiDumbbell className='-mt-1 inline text-lg' /> {name}</h2>
            {lastRun && (
                <p className='text-indigo-600 text-sm'>
                    Last run: {formatDistance(lastRun, new Date())}
                </p>
            )}
            <Link 
                to={{ pathname: '/workout/new', search: `?id=${id}` }}
                className='bg-blue-600 text-white block px-2 py-1 rounded shadow focus:ring-2 focus:ring-blue-300 ml-auto mt-2 text-xs uppercase tracking-wider'>Start workout</Link>
        </div>
    );
}

function WorkoutList() {
    const { t } = useTranslation();
    const [workouts, setWorkouts] = useState(getWorkoutList());

    const onAddWorkout = (name) => {
        const workout = {
            id: genHash(), name, exercises: []
        };
        addWorkoutToList(workout);
        setWorkouts(workouts.concat([workout]));
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
