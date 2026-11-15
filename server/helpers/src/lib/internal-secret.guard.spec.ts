import { Metadata } from "@grpc/grpc-js";
import { type ExecutionContext } from "@nestjs/common";
import { UnauthenticatedError } from "./errors";
import {
  INTERNAL_SECRET_METADATA,
  InternalSecretGuard,
} from "./internal-secret.guard";

const SECRET = "s".repeat(32);

function contextWith(...values: string[]): ExecutionContext {
  const metadata = new Metadata();
  for (const value of values) {
    metadata.add(INTERNAL_SECRET_METADATA, value);
  }
  return {
    switchToRpc: () => ({ getContext: () => metadata }),
  } as unknown as ExecutionContext;
}

describe("InternalSecretGuard", () => {
  const guard = new InternalSecretGuard(SECRET);

  it("lets a call with the secret through", () => {
    expect(guard.canActivate(contextWith(SECRET))).toBe(true);
  });

  it.each([
    ["missing", contextWith()],
    ["wrong", contextWith("t".repeat(32))],
    ["a prefix of the secret", contextWith(SECRET.slice(1))],
    ["sent twice", contextWith(SECRET, SECRET)],
  ])("rejects a secret that is %s", (_, context) => {
    expect(() => guard.canActivate(context)).toThrow(UnauthenticatedError);
  });
});
