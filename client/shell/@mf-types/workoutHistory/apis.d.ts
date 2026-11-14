export type RemoteKeys = "workoutHistory/App";
type PackageType<T> = T extends "workoutHistory/App"
  ? typeof import("workoutHistory/App")
  : any;
