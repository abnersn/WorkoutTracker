import { cloneDeep } from 'lodash';
import genHash from './genHash';
import hasIncompleteSets from './hasIncompleteSets';

function getNextStageFor(stage) {
    const stages = ['IDLE', 'ACTIVE', 'RESTING', 'COMPLETE'];
    const index = stages.findIndex(s => s === stage);

    return stages[(index + 1) % stages.length];
}

function addNewSet(workout, payload) {
    const { exerciseId } = payload;

    const exercise = workout.exercises.find(
        ex => ex.id === exerciseId
    );
    const hash = genHash();
    exercise.sets = [
        ...exercise.sets,
        { id: hash, stage: 'IDLE' }
    ];
    workout.activeSetId = hash;
    return workout;
}

function removeSet(workout, payload) {
    const { exerciseId } = payload;

    const exercise = workout.exercises.find(
        ex => ex.id === exerciseId
    );
    const setIndex = exercise.sets.findIndex(s => s.id === workout.activeSetId);
    if (setIndex !== -1) {
        exercise.sets.splice(setIndex, 1);
        workout.activeSetId = null;
    }
    return workout;
}

function removeExercise(workout, payload) {
    const { exerciseId } = payload;

    workout.exercises = workout.exercises.filter(
        ex => ex.id !== exerciseId
    );

    return workout;
}

function updateActiveSet(workout, payload) {
    const { setId, exerciseId } = payload;

    workout.activeSetId = setId;
    workout.activeExerciseId = exerciseId;

    return workout;
}

function updateSetStage(workout, stage) {
    const exercise = workout.exercises.find(
        ex => ex.id === workout.activeExerciseId
    );
    const setIndex = exercise.sets.findIndex(
        s => s.id === workout.activeSetId
    );
    if (setIndex === -1) {
        return workout;
    }

    const currentStage = exercise.sets[setIndex].stage;
    const nextStage = stage || getNextStageFor(
        currentStage
    );

    if (nextStage === 'COMPLETE' && !stage) {
        const nextIndex = (setIndex + 1) % exercise.sets.length;
        workout.activeSetId = nextIndex > 0 ?
            exercise.sets[
                (setIndex + 1) % exercise.sets.length
            ].id :
            null;
    }

    exercise.sets[setIndex].stage = nextStage;

    if (!hasIncompleteSets(exercise)) {
        workout.activeSetId = null;
    }

    return workout;
}

function updateActiveExercise(workout) {
    const activeExerciseIdx = workout.exercises.findIndex(
        ex => ex.id === workout.activeExerciseId
    );
    const nextExerciseIdx = (activeExerciseIdx + 1) % workout.exercises.length;
    const nextExercise = workout.exercises[nextExerciseIdx];
    workout.activeExerciseId = nextExercise.id;
    workout.activeSetId = nextExercise.sets[0]?.id || null;

    return workout;
}

function addNewExercise(workout, payload) {
    const { name } = payload;
    workout.exercises.push({
        id: genHash(),
        name,
        sets: []
    });
    return workout;
}

function completeWorkout(workout) {
    workout.isComplete = true;
    return workout;
}

function moveExercise(workout, payload) {
    const { exerciseId, factor } = payload;

    const exerciseIndex = workout.exercises.findIndex(e => e.id === exerciseId);

    if (exerciseIndex === -1) {
        return workout;
    }

    const newIndex = Math.min(
        Math.max(0, exerciseIndex + factor), workout.exercises.length - 1
    );

    const exerciseA = workout.exercises[exerciseIndex];
    const exerciseB = workout.exercises[newIndex];

    workout.exercises[exerciseIndex] = exerciseB;
    workout.exercises[newIndex] = exerciseA;

    return workout;
}

function updateExerciseType(workout, payload) {
    const { exerciseId, type } = payload;

    const exerciseIndex = workout.exercises.findIndex(e => e.id === exerciseId);

    if (exerciseIndex === -1) {
        return workout;
    }

    workout.exercises[exerciseIndex].type = type;
    return workout;
}

export default function reducer(state, action) {
    const workout = cloneDeep(state);

    switch(action.type) {
        case 'SET_WORKOUT':
            return action.payload;
        case 'ADD_SET':
            return addNewSet(workout, action.payload);
        case 'REMOVE_SET':
            return removeSet(workout, action.payload);
        case 'UPDATE_ACTIVE_SET':
            return updateActiveSet(workout, action.payload);
        case 'UPDATE_SET_STAGE':
            return updateSetStage(workout); 
        case 'UPDATE_EXERCISE_TYPE':
            return updateExerciseType(workout, action.payload);
        case 'COMPLETE_EXERCISE':
            return updateActiveExercise(workout);
        case 'ADD_EXERCISE':
            return addNewExercise(workout, action.payload);
        case 'COMPLETE_WORKOUT':
            return completeWorkout(workout);
        case 'MOVE_EXERCISE':
            return moveExercise(workout, action.payload);
        case 'REMOVE_EXERCISE':
            return removeExercise(workout, action.payload);
        default:
            throw new Error();
    }
}