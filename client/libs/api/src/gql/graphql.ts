/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateLogInput = {
  activeExerciseId?: string | number | null | undefined;
  activeSetId?: string | number | null | undefined;
  date: string;
  duration: number;
  exercises: Array<ExerciseInput>;
  isComplete: boolean;
  name: string;
  /** The saved workout this was run from. */
  workoutId: string | number;
};

export type CreateWorkoutInput = {
  exercises?: Array<ExerciseInput>;
  name: string;
};

export type ExerciseInput = {
  /** Omit for a new exercise; the server assigns its id. */
  id?: string | number | null | undefined;
  name: string;
  rpe?: number | null | undefined;
  sets: Array<WorkoutSetInput>;
};

export type SetStage =
  | 'ACTIVE'
  | 'COMPLETE'
  | 'IDLE'
  | 'RESTING';

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  displayName: string;
  email: string;
  password: string;
};

export type UpdateLogInput = {
  activeExerciseId?: string | number | null | undefined;
  activeSetId?: string | number | null | undefined;
  date?: string | null | undefined;
  duration?: number | null | undefined;
  /** Replaces every exercise. */
  exercises?: Array<ExerciseInput> | null | undefined;
  id: string | number;
  isComplete?: boolean | null | undefined;
  name?: string | null | undefined;
};

export type UpdateWorkoutInput = {
  /** Replaces every exercise. */
  exercises?: Array<ExerciseInput> | null | undefined;
  id: string | number;
  name?: string | null | undefined;
};

export type WorkoutSetInput = {
  defaultReps?: number | null | undefined;
  /** Seconds. */
  defaultRestTime?: number | null | undefined;
  /** Always kg. */
  defaultWeight?: number | null | undefined;
  /** Omit for a new set; the server assigns its id. */
  id?: string | number | null | undefined;
  /** Epoch ms. Ignored on saved workouts. */
  restStartedAt?: number | null | undefined;
  /** Defaults to IDLE. Ignored on saved workouts. */
  stage?: SetStage | null | undefined;
};

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { signIn: { __typename: 'AuthPayload', token: string, user: { __typename: 'User', id: string, displayName: string } } };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { signUp: { __typename: 'AuthPayload', token: string, user: { __typename: 'User', id: string, displayName: string } } };

export type ExerciseFieldsFragment = { __typename: 'Exercise', id: string, name: string, rpe: number | null, sets: Array<{ __typename: 'WorkoutSet', id: string, stage: SetStage, defaultReps: number | null, defaultWeight: number | null, defaultRestTime: number | null, restStartedAt: number | null }> };

export type WorkoutFieldsFragment = { __typename: 'Workout', id: string, name: string, date: string, duration: number, isComplete: boolean, activeSetId: string | null, activeExerciseId: string | null, exercises: Array<{ __typename: 'Exercise', id: string, name: string, rpe: number | null, sets: Array<{ __typename: 'WorkoutSet', id: string, stage: SetStage, defaultReps: number | null, defaultWeight: number | null, defaultRestTime: number | null, restStartedAt: number | null }> }> };

export type LogFieldsFragment = { __typename: 'LogEntry', id: string, workoutId: string, name: string, date: string, duration: number, isComplete: boolean, activeSetId: string | null, activeExerciseId: string | null, exercises: Array<{ __typename: 'Exercise', id: string, name: string, rpe: number | null, sets: Array<{ __typename: 'WorkoutSet', id: string, stage: SetStage, defaultReps: number | null, defaultWeight: number | null, defaultRestTime: number | null, restStartedAt: number | null }> }> };

export type WorkoutsQueryVariables = Exact<{ [key: string]: never; }>;


export type WorkoutsQuery = { workouts: Array<{ __typename: 'Workout', id: string, name: string, lastRunAt: string | null }> };

export type LogsQueryVariables = Exact<{ [key: string]: never; }>;


export type LogsQuery = { logs: Array<{ __typename: 'LogEntry', id: string, name: string, date: string }> };

export type WorkoutQueryVariables = Exact<{
  id: string | number;
}>;


export type WorkoutQuery = { workout: { __typename: 'Workout', id: string, name: string, date: string, duration: number, isComplete: boolean, activeSetId: string | null, activeExerciseId: string | null, exercises: Array<{ __typename: 'Exercise', id: string, name: string, rpe: number | null, sets: Array<{ __typename: 'WorkoutSet', id: string, stage: SetStage, defaultReps: number | null, defaultWeight: number | null, defaultRestTime: number | null, restStartedAt: number | null }> }> } };

export type LogQueryVariables = Exact<{
  id: string | number;
}>;


export type LogQuery = { log: { __typename: 'LogEntry', id: string, workoutId: string, name: string, date: string, duration: number, isComplete: boolean, activeSetId: string | null, activeExerciseId: string | null, exercises: Array<{ __typename: 'Exercise', id: string, name: string, rpe: number | null, sets: Array<{ __typename: 'WorkoutSet', id: string, stage: SetStage, defaultReps: number | null, defaultWeight: number | null, defaultRestTime: number | null, restStartedAt: number | null }> }> } };

export type PreviousRunQueryVariables = Exact<{
  logId: string | number;
}>;


export type PreviousRunQuery = { previousRun: { __typename: 'LogEntry', id: string, workoutId: string, name: string, date: string, duration: number, isComplete: boolean, activeSetId: string | null, activeExerciseId: string | null, exercises: Array<{ __typename: 'Exercise', id: string, name: string, rpe: number | null, sets: Array<{ __typename: 'WorkoutSet', id: string, stage: SetStage, defaultReps: number | null, defaultWeight: number | null, defaultRestTime: number | null, restStartedAt: number | null }> }> } | null };

export type CreateWorkoutMutationVariables = Exact<{
  input: CreateWorkoutInput;
}>;


export type CreateWorkoutMutation = { createWorkout: { __typename: 'Workout', id: string, name: string, lastRunAt: string | null } };

export type UpdateWorkoutMutationVariables = Exact<{
  input: UpdateWorkoutInput;
}>;


export type UpdateWorkoutMutation = { updateWorkout: { __typename: 'Workout', id: string, name: string, date: string, duration: number, isComplete: boolean, activeSetId: string | null, activeExerciseId: string | null, exercises: Array<{ __typename: 'Exercise', id: string, name: string, rpe: number | null, sets: Array<{ __typename: 'WorkoutSet', id: string, stage: SetStage, defaultReps: number | null, defaultWeight: number | null, defaultRestTime: number | null, restStartedAt: number | null }> }> } };

export type DeleteWorkoutMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteWorkoutMutation = { deleteWorkout: string };

export type CreateLogMutationVariables = Exact<{
  input: CreateLogInput;
}>;


export type CreateLogMutation = { createLog: { __typename: 'LogEntry', id: string, workoutId: string, name: string, date: string, duration: number, isComplete: boolean, activeSetId: string | null, activeExerciseId: string | null, exercises: Array<{ __typename: 'Exercise', id: string, name: string, rpe: number | null, sets: Array<{ __typename: 'WorkoutSet', id: string, stage: SetStage, defaultReps: number | null, defaultWeight: number | null, defaultRestTime: number | null, restStartedAt: number | null }> }> } };

export type UpdateLogMutationVariables = Exact<{
  input: UpdateLogInput;
}>;


export type UpdateLogMutation = { updateLog: { __typename: 'LogEntry', id: string, workoutId: string, name: string, date: string, duration: number, isComplete: boolean, activeSetId: string | null, activeExerciseId: string | null, exercises: Array<{ __typename: 'Exercise', id: string, name: string, rpe: number | null, sets: Array<{ __typename: 'WorkoutSet', id: string, stage: SetStage, defaultReps: number | null, defaultWeight: number | null, defaultRestTime: number | null, restStartedAt: number | null }> }> } };

export type DeleteLogMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteLogMutation = { deleteLog: string };

export const ExerciseFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExerciseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rpe"}},{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"defaultReps"}},{"kind":"Field","name":{"kind":"Name","value":"defaultWeight"}},{"kind":"Field","name":{"kind":"Name","value":"defaultRestTime"}},{"kind":"Field","name":{"kind":"Name","value":"restStartedAt"}}]}}]}}]} as unknown as DocumentNode<ExerciseFieldsFragment, unknown>;
export const WorkoutFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WorkoutFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Workout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}},{"kind":"Field","name":{"kind":"Name","value":"activeSetId"}},{"kind":"Field","name":{"kind":"Name","value":"activeExerciseId"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExerciseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rpe"}},{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"defaultReps"}},{"kind":"Field","name":{"kind":"Name","value":"defaultWeight"}},{"kind":"Field","name":{"kind":"Name","value":"defaultRestTime"}},{"kind":"Field","name":{"kind":"Name","value":"restStartedAt"}}]}}]}}]} as unknown as DocumentNode<WorkoutFieldsFragment, unknown>;
export const LogFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LogFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LogEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workoutId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}},{"kind":"Field","name":{"kind":"Name","value":"activeSetId"}},{"kind":"Field","name":{"kind":"Name","value":"activeExerciseId"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExerciseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rpe"}},{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"defaultReps"}},{"kind":"Field","name":{"kind":"Name","value":"defaultWeight"}},{"kind":"Field","name":{"kind":"Name","value":"defaultRestTime"}},{"kind":"Field","name":{"kind":"Name","value":"restStartedAt"}}]}}]}}]} as unknown as DocumentNode<LogFieldsFragment, unknown>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const WorkoutsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Workouts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workouts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastRunAt"}}]}}]}}]} as unknown as DocumentNode<WorkoutsQuery, WorkoutsQueryVariables>;
export const LogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Logs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]} as unknown as DocumentNode<LogsQuery, LogsQueryVariables>;
export const WorkoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Workout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WorkoutFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExerciseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rpe"}},{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"defaultReps"}},{"kind":"Field","name":{"kind":"Name","value":"defaultWeight"}},{"kind":"Field","name":{"kind":"Name","value":"defaultRestTime"}},{"kind":"Field","name":{"kind":"Name","value":"restStartedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WorkoutFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Workout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}},{"kind":"Field","name":{"kind":"Name","value":"activeSetId"}},{"kind":"Field","name":{"kind":"Name","value":"activeExerciseId"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseFields"}}]}}]}}]} as unknown as DocumentNode<WorkoutQuery, WorkoutQueryVariables>;
export const LogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Log"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"log"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LogFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExerciseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rpe"}},{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"defaultReps"}},{"kind":"Field","name":{"kind":"Name","value":"defaultWeight"}},{"kind":"Field","name":{"kind":"Name","value":"defaultRestTime"}},{"kind":"Field","name":{"kind":"Name","value":"restStartedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LogFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LogEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workoutId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}},{"kind":"Field","name":{"kind":"Name","value":"activeSetId"}},{"kind":"Field","name":{"kind":"Name","value":"activeExerciseId"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseFields"}}]}}]}}]} as unknown as DocumentNode<LogQuery, LogQueryVariables>;
export const PreviousRunDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PreviousRun"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"logId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previousRun"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"logId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"logId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LogFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExerciseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rpe"}},{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"defaultReps"}},{"kind":"Field","name":{"kind":"Name","value":"defaultWeight"}},{"kind":"Field","name":{"kind":"Name","value":"defaultRestTime"}},{"kind":"Field","name":{"kind":"Name","value":"restStartedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LogFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LogEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workoutId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}},{"kind":"Field","name":{"kind":"Name","value":"activeSetId"}},{"kind":"Field","name":{"kind":"Name","value":"activeExerciseId"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseFields"}}]}}]}}]} as unknown as DocumentNode<PreviousRunQuery, PreviousRunQueryVariables>;
export const CreateWorkoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorkout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWorkoutInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorkout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastRunAt"}}]}}]}}]} as unknown as DocumentNode<CreateWorkoutMutation, CreateWorkoutMutationVariables>;
export const UpdateWorkoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWorkout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWorkoutInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWorkout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WorkoutFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExerciseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rpe"}},{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"defaultReps"}},{"kind":"Field","name":{"kind":"Name","value":"defaultWeight"}},{"kind":"Field","name":{"kind":"Name","value":"defaultRestTime"}},{"kind":"Field","name":{"kind":"Name","value":"restStartedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WorkoutFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Workout"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}},{"kind":"Field","name":{"kind":"Name","value":"activeSetId"}},{"kind":"Field","name":{"kind":"Name","value":"activeExerciseId"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseFields"}}]}}]}}]} as unknown as DocumentNode<UpdateWorkoutMutation, UpdateWorkoutMutationVariables>;
export const DeleteWorkoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteWorkout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteWorkout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteWorkoutMutation, DeleteWorkoutMutationVariables>;
export const CreateLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LogFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExerciseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rpe"}},{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"defaultReps"}},{"kind":"Field","name":{"kind":"Name","value":"defaultWeight"}},{"kind":"Field","name":{"kind":"Name","value":"defaultRestTime"}},{"kind":"Field","name":{"kind":"Name","value":"restStartedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LogFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LogEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workoutId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}},{"kind":"Field","name":{"kind":"Name","value":"activeSetId"}},{"kind":"Field","name":{"kind":"Name","value":"activeExerciseId"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseFields"}}]}}]}}]} as unknown as DocumentNode<CreateLogMutation, CreateLogMutationVariables>;
export const UpdateLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LogFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExerciseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Exercise"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rpe"}},{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stage"}},{"kind":"Field","name":{"kind":"Name","value":"defaultReps"}},{"kind":"Field","name":{"kind":"Name","value":"defaultWeight"}},{"kind":"Field","name":{"kind":"Name","value":"defaultRestTime"}},{"kind":"Field","name":{"kind":"Name","value":"restStartedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LogFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LogEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workoutId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}},{"kind":"Field","name":{"kind":"Name","value":"activeSetId"}},{"kind":"Field","name":{"kind":"Name","value":"activeExerciseId"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExerciseFields"}}]}}]}}]} as unknown as DocumentNode<UpdateLogMutation, UpdateLogMutationVariables>;
export const DeleteLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteLogMutation, DeleteLogMutationVariables>;