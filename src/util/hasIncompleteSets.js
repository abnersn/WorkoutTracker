export default function hasIncompleteSets(exercise) {
    return exercise.sets.some(s => s.stage !== 'COMPLETE');
}