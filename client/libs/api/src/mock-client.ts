import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import type { FormattedExecutionResult } from "graphql";
import { of } from "rxjs";

/** Answers for each operation, by name (e.g. "Log", "PreviousRun"). */
export type MockResolvers = Record<
  string,
  (variables: Record<string, unknown>) => FormattedExecutionResult
>;

/**
 * An Apollo client that never touches the network, for Storybook and tests.
 * Results must carry `__typename`, as the server's do. An operation with no
 * resolver fails, so a missing fixture shows up as an error state.
 */
export function createMockClient(resolvers: MockResolvers): ApolloClient {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new ApolloLink((operation) => {
      const resolve = resolvers[operation.operationName ?? ""];
      return of(
        resolve
          ? resolve(operation.variables)
          : {
              errors: [
                { message: `No mock for operation ${operation.operationName}` },
              ],
            },
      );
    }),
  });
}

/** A GraphQL error result, as the gateway sends for a missing id. */
export const notFound = (): FormattedExecutionResult => ({
  errors: [{ message: "Not found", extensions: { code: "NOT_FOUND" } }],
});
