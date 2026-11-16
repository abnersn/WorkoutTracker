// Every GraphQL operation the client runs. Only the hooks in this folder use
// them; screens see domain types from @workout-tracker/types instead.
import { graphql } from "@workout-tracker/api";

graphql(/* GraphQL */ `
  fragment ExerciseFields on Exercise {
    id
    name
    rpe
    sets {
      id
      stage
      defaultReps
      defaultWeight
      defaultRestTime
      restStartedAt
    }
  }
`);

graphql(/* GraphQL */ `
  fragment WorkoutFields on Workout {
    id
    name
    date
    duration
    isComplete
    activeSetId
    activeExerciseId
    exercises {
      ...ExerciseFields
    }
  }
`);

graphql(/* GraphQL */ `
  fragment LogFields on LogEntry {
    id
    workoutId
    name
    date
    duration
    isComplete
    activeSetId
    activeExerciseId
    exercises {
      ...ExerciseFields
    }
  }
`);

export const WorkoutsQuery = graphql(/* GraphQL */ `
  query Workouts {
    workouts {
      id
      name
      lastRunAt
    }
  }
`);

export const LogsQuery = graphql(/* GraphQL */ `
  query Logs {
    logs {
      id
      name
      date
    }
  }
`);

export const WorkoutQuery = graphql(/* GraphQL */ `
  query Workout($id: ID!) {
    workout(id: $id) {
      ...WorkoutFields
    }
  }
`);

export const LogQuery = graphql(/* GraphQL */ `
  query Log($id: ID!) {
    log(id: $id) {
      ...LogFields
    }
  }
`);

export const PreviousRunQuery = graphql(/* GraphQL */ `
  query PreviousRun($logId: ID!) {
    previousRun(logId: $logId) {
      ...LogFields
    }
  }
`);

export const CreateWorkoutMutation = graphql(/* GraphQL */ `
  mutation CreateWorkout($input: CreateWorkoutInput!) {
    createWorkout(input: $input) {
      id
      name
      lastRunAt
    }
  }
`);

export const UpdateWorkoutMutation = graphql(/* GraphQL */ `
  mutation UpdateWorkout($input: UpdateWorkoutInput!) {
    updateWorkout(input: $input) {
      ...WorkoutFields
    }
  }
`);

export const DeleteWorkoutMutation = graphql(/* GraphQL */ `
  mutation DeleteWorkout($id: ID!) {
    deleteWorkout(id: $id)
  }
`);

export const CreateLogMutation = graphql(/* GraphQL */ `
  mutation CreateLog($input: CreateLogInput!) {
    createLog(input: $input) {
      ...LogFields
    }
  }
`);

export const UpdateLogMutation = graphql(/* GraphQL */ `
  mutation UpdateLog($input: UpdateLogInput!) {
    updateLog(input: $input) {
      ...LogFields
    }
  }
`);

export const DeleteLogMutation = graphql(/* GraphQL */ `
  mutation DeleteLog($id: ID!) {
    deleteLog(id: $id)
  }
`);
