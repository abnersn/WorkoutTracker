export type RemoteKeys = "workoutView/App";
type PackageType<T> = T extends "workoutView/App"
  ? typeof import("workoutView/App")
  : any;
