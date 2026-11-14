
    export type RemoteKeys = 'workoutList/App';
    type PackageType<T> = T extends 'workoutList/App' ? typeof import('workoutList/App') :any;