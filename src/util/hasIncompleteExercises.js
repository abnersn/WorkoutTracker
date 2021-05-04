import hasIncompleteSets from "./hasIncompleteSets";

export default function hasIncompleteExercises(workout) {
    return workout.exercises.some(hasIncompleteSets);
}