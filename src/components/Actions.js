import { BiCheck, BiPause, BiPlay, BiRefresh, BiTrophy } from "react-icons/bi";
import hasIncompleteSets from "../util/hasIncompleteSets";

function CompleteExerciseButton({ onClickCompleteExercise = () => {} }) {
    const color = 'green';
    return (
        <button
            className={`btn bg-${color}-500 ml-2 border-${color}-600 focus:ring-${color}-200 active:bg-${color}-700`}
        >
            <BiTrophy className='mr-1 text-lg' /> Finish
        </button>
    )
}

function CycleButton({ stage, onClick = () => {} }) {
    const labels = {
        IDLE: 'Start',
        ACTIVE: 'Rest',
        RESTING: 'Complete',
        COMPLETE: 'Restart'
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

    return (
        <div className='flex justify-end fixed items-center border-t border-indigo-200 bottom-0 bg-white w-full left-0 p-3'>
            {set && <CycleButton onClick={updateStage} stage={set.stage} />}
            {exercise && !hasIncompleteSets(exercise) && <CompleteExerciseButton />}
        </div>
    )
}