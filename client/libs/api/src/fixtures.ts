import type { LogFieldsFragment } from "./gql/graphql";

/** One finished "Push day", shaped as the gateway returns it. For stories. */
export const pushDayLog: LogFieldsFragment = {
  __typename: "LogEntry",
  id: "665f1c2e8a1b2c3d4e5f6a7b",
  workoutId: "665f1c2e8a1b2c3d4e5f6a70",
  name: "Push day",
  date: new Date().toISOString(),
  duration: 2712,
  isComplete: true,
  activeSetId: null,
  activeExerciseId: null,
  exercises: [
    {
      __typename: "Exercise",
      id: "665f1c2e8a1b2c3d4e5f6a71",
      name: "Bench press",
      rpe: 8,
      sets: [1, 2, 3].map((n) => ({
        __typename: "WorkoutSet" as const,
        id: `665f1c2e8a1b2c3d4e5f6a8${n}`,
        stage: "COMPLETE" as const,
        defaultReps: 8,
        defaultWeight: 60 + n * 5,
        defaultRestTime: 90,
        restStartedAt: null,
      })),
    },
  ],
};
