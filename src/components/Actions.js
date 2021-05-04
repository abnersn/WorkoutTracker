import { BiCheck, BiPause, BiPlay, BiRefresh, BiStar, BiTrophy } from "react-icons/bi";
import hasIncompleteExercises from "../util/hasIncompleteExercises";
import hasIncompleteSets from "../util/hasIncompleteSets";

function CompleteWorkoutButton({ onClick = () => {} }) {
    const color = 'green';
    return (
        <button
            onClick={onClick}
            className={`btn bg-${color}-500 ml-2 border-${color}-600 focus:ring-${color}-200 active:bg-${color}-700`}
        >
            <BiTrophy className='mr-1 text-lg' /> Complete workout
        </button>
    )
}

function CompleteExerciseButton({ onClick = () => {} }) {
    const color = 'green';
    return (
        <button
            onClick={onClick}
            className={`btn bg-${color}-500 ml-2 border-${color}-600 focus:ring-${color}-200 active:bg-${color}-700`}
        >
            <BiStar className='mr-1 text-lg' /> Finish
        </button>
    )
}

function CycleButton({ stage, onClick = () => {} }) {
    const labels = {
        IDLE: 'Start',
        ACTIVE: 'Rest',
        RESTING: 'Complete',
        COMPLETE: 'Reset'
    }

    const icons = {
        IDLE: BiPlay,
        ACTIVE: BiPause,
        RESTING: BiCheck,
        COMPLETE: BiRefresh
    }

    const colors = {
        IDLE: 'indigo',
        ACTIVE: 'indigo',
        RESTING: 'indigo',
        COMPLETE: 'blue'
    }

    const label = labels[stage];
    const Icon = icons[stage];
    const color = colors[stage];

    return (
        <button
            onClick={onClick}
            className={`btn bg-${color}-500 border-${color}-600 focus:ring-${color}-200 active:bg-${color}-700`}
        >
            {<Icon stage={stage} className='mr-1 text-lg' />}{label}
        </button>
    )
}

export default function Actions(props) {
    const {
        state, dispatch
    } = props;

    const exercise = state.exercises.find(
        e => e.id === state.activeExerciseId
    );

    const set = exercise ? exercise.sets.find(
        s => s.id === state.activeSetId
    ) : null;

    const updateStage = () => {
        dispatch({
            type: 'UPDATE_SET_STAGE'
        });
    }

    const completeExercise = () => {
        dispatch({
            type: 'COMPLETE_EXERCISE'
        })
    }

    const completeWorkout = () => {
        console.log('COMPLETE!');
    }

    let button = null;

    if (exercise) {
        if (!hasIncompleteExercises(state)) {
            button = <CompleteWorkoutButton onClick={completeWorkout} />;
        } else if (!hasIncompleteSets(exercise)) {
            button = <CompleteExerciseButton onClick={completeExercise} />;
        }
    }

    return (
        <div className='flex justify-end sticky items-center border-t border-indigo-200 bottom-0 bg-white w-full left-0 p-3'>
            {set && <CycleButton onClick={updateStage} stage={set.stage} />}
            {button}
        </div>
    )
}