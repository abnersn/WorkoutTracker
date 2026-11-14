
    export type RemoteKeys = 'workoutNew/App' | 'workoutNew/Workout';
    type PackageType<T> = T extends 'workoutNew/Workout' ? typeof import('workoutNew/Workout') :T extends 'workoutNew/App' ? typeof import('workoutNew/App') :any;