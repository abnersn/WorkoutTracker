import { BiCheck, BiPause, BiPlay, BiSkipNext, BiTrophy } from "react-icons/bi";

function CompleteExerciseButton({ onClickCompleteExercise = () => {} }) {
    const color = 'green';
    return (
        <button
            className={`btn bg-${color}-500 border-${color}-600 focus:ring-${color}-200 active:bg-${color}-700`}
            onClick={onClickCompleteExercise}>
            <BiTrophy className='mr-1 text-lg' /> Finish
        </button>
    )
}

function CycleButton({ stage, onClick = () => {} }) {
    const labels = {
        IDLE: 'Start',
        ACTIVE: 'Rest',
        RESTING: 'Complete',
        COMPLETE: 'Next'
    }

    const icons = {
        IDLE: BiPlay,
        ACTIVE: BiPause,
        RESTING: BiCheck,
        COMPLETE: BiSkipNext
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
            className={`btn bg-${color}-500 border-${color}-600 focus:ring-${color}-200 active:bg-${color}-700`}
            onClick={onClick}>
            {<Icon stage={stage} className='mr-1 text-lg' />}{label}
        </button>
    )
}

export default function Actions(props) {
    const {
        exercise,
        set,
        onActionButtonClick = () => {},
        onCompleteExerciseClick = () => {}
    } = props;

    if (!exercise) {
        return <></>;
    }

    let footerButton = null;

    if (!exercise.sets.some(s => s.stage !== 'COMPLETE')) {
        footerButton = <CompleteExerciseButton
            onCompleteExerciseClick={onCompleteExerciseClick}
        />;
    } else if (set !== null) {
        footerButton = <CycleButton
            stage={set.stage}
            onClick={onActionButtonClick}
        />;
    }

    return (
        <div className='flex fixed items-center border-t border-indigo-200 bottom-0 bg-white w-full left-0 p-3'>
            <h3 className='text-lg font-semibold text-indigo-800 -mb-1'>
                {exercise.name}
            </h3>
            {footerButton}
        </div>
    )
}