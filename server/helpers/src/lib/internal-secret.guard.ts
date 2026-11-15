import { createHash, timingSafeEqual } from "node:crypto";
import type { Metadata } from "@grpc/grpc-js";
import { type CanActivate, type ExecutionContext } from "@nestjs/common";
import { UnauthenticatedError } from "./errors";

// Every call between services carries the shared INTERNAL_SECRET in this
// metadata key, so only our own services (the gateway, later) can call a
// service, even if its port is reachable.
export const INTERNAL_SECRET_METADATA = "x-internal-secret";

// Hashing first makes both sides the same length, which timingSafeEqual
// requires, without revealing the secret's length through timing.
const digest = (value: string): Buffer =>
  createHash("sha256").update(value).digest();

// Each service registers it as APP_GUARD, built from INTERNAL_SECRET (that
// wiring stays in the modules: @nestjs/config is ESM-only, which Jest can't
// load from this shared library).
export class InternalSecretGuard implements CanActivate {
  private readonly expected: Buffer;

  constructor(secret: string) {
    this.expected = digest(secret);
  }

  canActivate(context: ExecutionContext): boolean {
    const metadata = context.switchToRpc().getContext<Metadata | undefined>();
    const values = metadata?.get(INTERNAL_SECRET_METADATA) ?? [];
    const [value] = values;
    if (
      values.length !== 1 ||
      typeof value !== "string" ||
      !timingSafeEqual(digest(value), this.expected)
    ) {
      throw new UnauthenticatedError("missing or invalid internal secret");
    }
    return true;
  }
}
