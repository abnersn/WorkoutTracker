import type { ApolloCache } from "@apollo/client";

/**
 * Removes a deleted object from the cache. Lists that referenced it drop it
 * on their next read, so every screen showing it updates at once.
 */
export function evict(
  cache: ApolloCache,
  __typename: "Workout" | "LogEntry",
  id: string,
): void {
  cache.evict({ id: cache.identify({ __typename, id }) });
  cache.gc();
}
