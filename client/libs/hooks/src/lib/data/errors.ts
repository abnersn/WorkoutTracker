import { CombinedGraphQLErrors } from "@apollo/client";

/** Why data couldn't be loaded, in terms a screen can act on. */
export interface DataError {
  /**
   * `not-found`: it doesn't exist or isn't yours (including a malformed id
   * from an old link). `unavailable`: the server couldn't be reached or failed.
   */
  kind: "not-found" | "unavailable";
  message: string;
}

const NOT_FOUND_CODES = new Set(["NOT_FOUND", "BAD_USER_INPUT"]);

export function toDataError(error: unknown): DataError | null {
  if (!error) {
    return null;
  }
  if (
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((e) =>
      NOT_FOUND_CODES.has(String(e.extensions?.["code"])),
    )
  ) {
    return { kind: "not-found", message: "It may have been deleted." };
  }
  return {
    kind: "unavailable",
    message:
      "Your workouts couldn't be reached. Check your connection, then try again.",
  };
}
