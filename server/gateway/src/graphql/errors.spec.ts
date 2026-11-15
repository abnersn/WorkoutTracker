import { status } from "@grpc/grpc-js";
import { ValidationError } from "class-validator";
import { toGraphQLError } from "./to-graphql-error";
import { toValidationGraphQLError } from "./validation-error";

const issue = (
  property: string,
  constraints?: Record<string, string>,
  children: ValidationError[] = [],
): ValidationError =>
  Object.assign(new ValidationError(), {
    property,
    constraints,
    children,
  });

describe("toValidationGraphQLError", () => {
  it("reports nested failures with their path as BAD_USER_INPUT", () => {
    const err = toValidationGraphQLError([
      issue("name", { isLength: "name is too short" }),
      issue("exercises", undefined, [
        issue("0", undefined, [issue("rpe", { max: "rpe is too high" })]),
      ]),
    ]);
    expect(err.extensions).toEqual({
      code: "BAD_USER_INPUT",
      issues: [
        { path: "name", messages: ["name is too short"] },
        { path: "exercises[0].rpe", messages: ["rpe is too high"] },
      ],
    });
    expect(err.message).toBe(
      "name: name is too short; exercises[0].rpe: rpe is too high",
    );
  });
});

describe("toGraphQLError", () => {
  it("passes a public status's details through", () => {
    const err = toGraphQLError({ code: status.NOT_FOUND, details: "gone" });
    expect(err.message).toBe("gone");
    expect(err.extensions.code).toBe("NOT_FOUND");
  });

  it("turns ABORTED into a CONFLICT without the internal details", () => {
    const err = toGraphQLError({
      code: status.ABORTED,
      details: 'No matching document found for id "x" version 3',
    });
    expect(err.extensions.code).toBe("CONFLICT");
    expect(err.message).not.toContain("version");
  });

  it("masks everything else", () => {
    const err = toGraphQLError({ code: status.UNAVAILABLE, details: "conn" });
    expect(err.message).toBe("Something went wrong");
    expect(err.extensions.code).toBe("INTERNAL_SERVER_ERROR");
  });
});
