import {
  SetStage,
  type Exercise,
  type Workout,
  type WorkoutAction,
} from "./types";

function genHash(): string {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}

function hasIncompleteSets(exercise: Exercise): boolean {
  return exercise.sets.some((s) => s.stage !== SetStage.Complete);
}

function findExercise(
  workout: Workout,
  exerciseId: string | null | undefined,
): Exercise {
  const exercise = workout.exercises.find((ex) => ex.id === exerciseId);
  if (!exercise) {
    throw new Error(`Exercise not found: ${exerciseId}`);
  }
  return exercise;
}

function getNextStageFor(stage: SetStage): SetStage {
  const stages = Object.values(SetStage);
  const index = stages.findIndex((s) => s === stage);
  return stages[(index + 1) % stages.length];
}

function addNewSet(workout: Workout, exerciseId: string): Workout {
  const exercise = findExercise(workout, exerciseId);
  const hash = genHash();
  exercise.sets = [...exercise.sets, { id: hash, stage: SetStage.Idle }];
  workout.activeSetId = hash;
  return workout;
}

function removeSet(workout: Workout, exerciseId: string): Workout {
  const exercise = findExercise(workout, exerciseId);
  const setIndex = exercise.sets.findIndex((s) => s.id === workout.activeSetId);
  if (setIndex !== -1) {
    exercise.sets.splice(setIndex, 1);
    workout.activeSetId = null;
  }
  return workout;
}

function removeExercise(workout: Workout, exerciseId: string): Workout {
  workout.exercises = workout.exercises.filter((ex) => ex.id !== exerciseId);
  return workout;
}

function updateActiveSet(
  workout: Workout,
  setId: string,
  exerciseId: string,
): Workout {
  workout.activeSetId = setId;
  workout.activeExerciseId = exerciseId;
  return workout;
}

function updateSetStage(workout: Workout): Workout {
  const exercise = findExercise(workout, workout.activeExerciseId);
  const setIndex = exercise.sets.findIndex((s) => s.id === workout.activeSetId);
  if (setIndex === -1) {
    return workout;
  }

  const currentStage = exercise.sets[setIndex].stage;
  const nextStage = getNextStageFor(currentStage);

  if (nextStage === SetStage.Complete) {
    const nextIndex = (setIndex + 1) % exercise.sets.length;
    workout.activeSetId = nextIndex > 0 ? exercise.sets[nextIndex].id : null;
  }

  exercise.sets[setIndex].stage = nextStage;

  if (!hasIncompleteSets(exercise)) {
    workout.activeSetId = null;
  }

  return workout;
}

function updateActiveExercise(workout: Workout): Workout {
  const activeExerciseIdx = workout.exercises.findIndex(
    (ex) => ex.id === workout.activeExerciseId,
  );
  const nextExerciseIdx = (activeExerciseIdx + 1) % workout.exercises.length;
  const nextExercise = workout.exercises[nextExerciseIdx];
  workout.activeExerciseId = nextExercise.id;
  workout.activeSetId = nextExercise.sets[0]?.id ?? null;
  return workout;
}

function addNewExercise(workout: Workout, name: string): Workout {
  workout.exercises.push({ id: genHash(), name, sets: [] });
  return workout;
}

function completeWorkout(workout: Workout): Workout {
  workout.isComplete = true;
  return workout;
}

function moveExercise(
  workout: Workout,
  exerciseId: string,
  factor: number,
): Workout {
  const exerciseIndex = workout.exercises.findIndex((e) => e.id === exerciseId);
  if (exerciseIndex === -1) {
    return workout;
  }

  const newIndex = Math.min(
    Math.max(0, exerciseIndex + factor),
    workout.exercises.length - 1,
  );

  const exerciseA = workout.exercises[exerciseIndex];
  const exerciseB = workout.exercises[newIndex];

  workout.exercises[exerciseIndex] = exerciseB;
  workout.exercises[newIndex] = exerciseA;

  return workout;
}

function updateExerciseType(
  workout: Workout,
  exerciseId: string,
  type: string,
): Workout {
  const exerciseIndex = workout.exercises.findIndex((e) => e.id === exerciseId);
  if (exerciseIndex === -1) {
    return workout;
  }

  workout.exercises[exerciseIndex].type = type;
  return workout;
}

export function reducer(state: Workout, action: WorkoutAction): Workout {
  const workout = structuredClone(state);

  switch (action.type) {
    case "SET_WORKOUT":
      return action.payload;
    case "ADD_SET":
      return addNewSet(workout, action.payload.exerciseId);
    case "REMOVE_SET":
      return removeSet(workout, action.payload.exerciseId);
    case "UPDATE_ACTIVE_SET":
      return updateActiveSet(
        workout,
        action.payload.setId,
        action.payload.exerciseId,
      );
    case "UPDATE_SET_STAGE":
      return updateSetStage(workout);
    case "UPDATE_EXERCISE_TYPE":
      return updateExerciseType(
        workout,
        action.payload.exerciseId,
        action.payload.type,
      );
    case "COMPLETE_EXERCISE":
      return updateActiveExercise(workout);
    case "ADD_EXERCISE":
      return addNewExercise(workout, action.payload.name);
    case "COMPLETE_WORKOUT":
      return completeWorkout(workout);
    case "MOVE_EXERCISE":
      return moveExercise(
        workout,
        action.payload.exerciseId,
        action.payload.factor,
      );
    case "REMOVE_EXERCISE":
      return removeExercise(workout, action.payload.exerciseId);
    default:
      throw new Error();
  }
}
