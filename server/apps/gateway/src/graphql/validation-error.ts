import type { ValidationError } from "class-validator";
import { GraphQLError } from "graphql";

export interface InputIssue {
  path: string;
  messages: string[];
}

// Nested inputs (exercises[0].sets[1]) report their failures as children.
export function flattenIssues(
  errors: ValidationError[],
  parent = "",
): InputIssue[] {
  return errors.flatMap((error) => {
    const path = /^\d+$/.test(error.property)
      ? `${parent}[${error.property}]`
      : parent
        ? `${parent}.${error.property}`
        : error.property;
    const own = error.constraints
      ? [{ path, messages: Object.values(error.constraints) }]
      : [];
    return [...own, ...flattenIssues(error.children ?? [], path)];
  });
}

/**
 * The ValidationPipe's error, shaped like a gRPC INVALID_ARGUMENT after
 * toGraphQLError, so clients handle bad input one way wherever it is caught.
 */
export function toValidationGraphQLError(
  errors: ValidationError[],
): GraphQLError {
  const issues = flattenIssues(errors);
  const message = issues
    .map(({ path, messages }) => `${path}: ${messages.join(", ")}`)
    .join("; ");
  return new GraphQLError(message || "Invalid input", {
    extensions: { code: "BAD_USER_INPUT", issues },
  });
}
