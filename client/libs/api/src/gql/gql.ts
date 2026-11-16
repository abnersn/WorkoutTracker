/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation SignIn($input: SignInInput!) {\n    signIn(input: $input) {\n      token\n      user {\n        id\n        displayName\n      }\n    }\n  }\n": typeof types.SignInDocument,
    "\n  mutation SignUp($input: SignUpInput!) {\n    signUp(input: $input) {\n      token\n      user {\n        id\n        displayName\n      }\n    }\n  }\n": typeof types.SignUpDocument,
    "\n  fragment ExerciseFields on Exercise {\n    id\n    name\n    rpe\n    sets {\n      id\n      stage\n      defaultReps\n      defaultWeight\n      defaultRestTime\n      restStartedAt\n    }\n  }\n": typeof types.ExerciseFieldsFragmentDoc,
    "\n  fragment WorkoutFields on Workout {\n    id\n    name\n    date\n    duration\n    isComplete\n    activeSetId\n    activeExerciseId\n    exercises {\n      ...ExerciseFields\n    }\n  }\n": typeof types.WorkoutFieldsFragmentDoc,
    "\n  fragment LogFields on LogEntry {\n    id\n    workoutId\n    name\n    date\n    duration\n    isComplete\n    activeSetId\n    activeExerciseId\n    exercises {\n      ...ExerciseFields\n    }\n  }\n": typeof types.LogFieldsFragmentDoc,
    "\n  query Workouts {\n    workouts {\n      id\n      name\n      lastRunAt\n    }\n  }\n": typeof types.WorkoutsDocument,
    "\n  query Logs {\n    logs {\n      id\n      name\n      date\n    }\n  }\n": typeof types.LogsDocument,
    "\n  query Workout($id: ID!) {\n    workout(id: $id) {\n      ...WorkoutFields\n    }\n  }\n": typeof types.WorkoutDocument,
    "\n  query Log($id: ID!) {\n    log(id: $id) {\n      ...LogFields\n    }\n  }\n": typeof types.LogDocument,
    "\n  query PreviousRun($logId: ID!) {\n    previousRun(logId: $logId) {\n      ...LogFields\n    }\n  }\n": typeof types.PreviousRunDocument,
    "\n  mutation CreateWorkout($input: CreateWorkoutInput!) {\n    createWorkout(input: $input) {\n      id\n      name\n      lastRunAt\n    }\n  }\n": typeof types.CreateWorkoutDocument,
    "\n  mutation UpdateWorkout($input: UpdateWorkoutInput!) {\n    updateWorkout(input: $input) {\n      ...WorkoutFields\n    }\n  }\n": typeof types.UpdateWorkoutDocument,
    "\n  mutation DeleteWorkout($id: ID!) {\n    deleteWorkout(id: $id)\n  }\n": typeof types.DeleteWorkoutDocument,
    "\n  mutation CreateLog($input: CreateLogInput!) {\n    createLog(input: $input) {\n      ...LogFields\n    }\n  }\n": typeof types.CreateLogDocument,
    "\n  mutation UpdateLog($input: UpdateLogInput!) {\n    updateLog(input: $input) {\n      ...LogFields\n    }\n  }\n": typeof types.UpdateLogDocument,
    "\n  mutation DeleteLog($id: ID!) {\n    deleteLog(id: $id)\n  }\n": typeof types.DeleteLogDocument,
};
const documents: Documents = {
    "\n  mutation SignIn($input: SignInInput!) {\n    signIn(input: $input) {\n      token\n      user {\n        id\n        displayName\n      }\n    }\n  }\n": types.SignInDocument,
    "\n  mutation SignUp($input: SignUpInput!) {\n    signUp(input: $input) {\n      token\n      user {\n        id\n        displayName\n      }\n    }\n  }\n": types.SignUpDocument,
    "\n  fragment ExerciseFields on Exercise {\n    id\n    name\n    rpe\n    sets {\n      id\n      stage\n      defaultReps\n      defaultWeight\n      defaultRestTime\n      restStartedAt\n    }\n  }\n": types.ExerciseFieldsFragmentDoc,
    "\n  fragment WorkoutFields on Workout {\n    id\n    name\n    date\n    duration\n    isComplete\n    activeSetId\n    activeExerciseId\n    exercises {\n      ...ExerciseFields\n    }\n  }\n": types.WorkoutFieldsFragmentDoc,
    "\n  fragment LogFields on LogEntry {\n    id\n    workoutId\n    name\n    date\n    duration\n    isComplete\n    activeSetId\n    activeExerciseId\n    exercises {\n      ...ExerciseFields\n    }\n  }\n": types.LogFieldsFragmentDoc,
    "\n  query Workouts {\n    workouts {\n      id\n      name\n      lastRunAt\n    }\n  }\n": types.WorkoutsDocument,
    "\n  query Logs {\n    logs {\n      id\n      name\n      date\n    }\n  }\n": types.LogsDocument,
    "\n  query Workout($id: ID!) {\n    workout(id: $id) {\n      ...WorkoutFields\n    }\n  }\n": types.WorkoutDocument,
    "\n  query Log($id: ID!) {\n    log(id: $id) {\n      ...LogFields\n    }\n  }\n": types.LogDocument,
    "\n  query PreviousRun($logId: ID!) {\n    previousRun(logId: $logId) {\n      ...LogFields\n    }\n  }\n": types.PreviousRunDocument,
    "\n  mutation CreateWorkout($input: CreateWorkoutInput!) {\n    createWorkout(input: $input) {\n      id\n      name\n      lastRunAt\n    }\n  }\n": types.CreateWorkoutDocument,
    "\n  mutation UpdateWorkout($input: UpdateWorkoutInput!) {\n    updateWorkout(input: $input) {\n      ...WorkoutFields\n    }\n  }\n": types.UpdateWorkoutDocument,
    "\n  mutation DeleteWorkout($id: ID!) {\n    deleteWorkout(id: $id)\n  }\n": types.DeleteWorkoutDocument,
    "\n  mutation CreateLog($input: CreateLogInput!) {\n    createLog(input: $input) {\n      ...LogFields\n    }\n  }\n": types.CreateLogDocument,
    "\n  mutation UpdateLog($input: UpdateLogInput!) {\n    updateLog(input: $input) {\n      ...LogFields\n    }\n  }\n": types.UpdateLogDocument,
    "\n  mutation DeleteLog($id: ID!) {\n    deleteLog(id: $id)\n  }\n": types.DeleteLogDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignIn($input: SignInInput!) {\n    signIn(input: $input) {\n      token\n      user {\n        id\n        displayName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignIn($input: SignInInput!) {\n    signIn(input: $input) {\n      token\n      user {\n        id\n        displayName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignUp($input: SignUpInput!) {\n    signUp(input: $input) {\n      token\n      user {\n        id\n        displayName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignUp($input: SignUpInput!) {\n    signUp(input: $input) {\n      token\n      user {\n        id\n        displayName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ExerciseFields on Exercise {\n    id\n    name\n    rpe\n    sets {\n      id\n      stage\n      defaultReps\n      defaultWeight\n      defaultRestTime\n      restStartedAt\n    }\n  }\n"): (typeof documents)["\n  fragment ExerciseFields on Exercise {\n    id\n    name\n    rpe\n    sets {\n      id\n      stage\n      defaultReps\n      defaultWeight\n      defaultRestTime\n      restStartedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment WorkoutFields on Workout {\n    id\n    name\n    date\n    duration\n    isComplete\n    activeSetId\n    activeExerciseId\n    exercises {\n      ...ExerciseFields\n    }\n  }\n"): (typeof documents)["\n  fragment WorkoutFields on Workout {\n    id\n    name\n    date\n    duration\n    isComplete\n    activeSetId\n    activeExerciseId\n    exercises {\n      ...ExerciseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment LogFields on LogEntry {\n    id\n    workoutId\n    name\n    date\n    duration\n    isComplete\n    activeSetId\n    activeExerciseId\n    exercises {\n      ...ExerciseFields\n    }\n  }\n"): (typeof documents)["\n  fragment LogFields on LogEntry {\n    id\n    workoutId\n    name\n    date\n    duration\n    isComplete\n    activeSetId\n    activeExerciseId\n    exercises {\n      ...ExerciseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Workouts {\n    workouts {\n      id\n      name\n      lastRunAt\n    }\n  }\n"): (typeof documents)["\n  query Workouts {\n    workouts {\n      id\n      name\n      lastRunAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Logs {\n    logs {\n      id\n      name\n      date\n    }\n  }\n"): (typeof documents)["\n  query Logs {\n    logs {\n      id\n      name\n      date\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Workout($id: ID!) {\n    workout(id: $id) {\n      ...WorkoutFields\n    }\n  }\n"): (typeof documents)["\n  query Workout($id: ID!) {\n    workout(id: $id) {\n      ...WorkoutFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Log($id: ID!) {\n    log(id: $id) {\n      ...LogFields\n    }\n  }\n"): (typeof documents)["\n  query Log($id: ID!) {\n    log(id: $id) {\n      ...LogFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PreviousRun($logId: ID!) {\n    previousRun(logId: $logId) {\n      ...LogFields\n    }\n  }\n"): (typeof documents)["\n  query PreviousRun($logId: ID!) {\n    previousRun(logId: $logId) {\n      ...LogFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateWorkout($input: CreateWorkoutInput!) {\n    createWorkout(input: $input) {\n      id\n      name\n      lastRunAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateWorkout($input: CreateWorkoutInput!) {\n    createWorkout(input: $input) {\n      id\n      name\n      lastRunAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateWorkout($input: UpdateWorkoutInput!) {\n    updateWorkout(input: $input) {\n      ...WorkoutFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateWorkout($input: UpdateWorkoutInput!) {\n    updateWorkout(input: $input) {\n      ...WorkoutFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteWorkout($id: ID!) {\n    deleteWorkout(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteWorkout($id: ID!) {\n    deleteWorkout(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateLog($input: CreateLogInput!) {\n    createLog(input: $input) {\n      ...LogFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateLog($input: CreateLogInput!) {\n    createLog(input: $input) {\n      ...LogFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateLog($input: UpdateLogInput!) {\n    updateLog(input: $input) {\n      ...LogFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateLog($input: UpdateLogInput!) {\n    updateLog(input: $input) {\n      ...LogFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteLog($id: ID!) {\n    deleteLog(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteLog($id: ID!) {\n    deleteLog(id: $id)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;