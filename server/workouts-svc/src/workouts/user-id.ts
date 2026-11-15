import type { Metadata } from "@grpc/grpc-js";
import { errors } from "@workout-tracker/helpers";
import { toUserId, type UserId } from "./ids";
import { isObjectIdOrHexString } from "mongoose";

// The gateway authenticates the caller and forwards their id in this
// metadata key; workouts-svc trusts it and scopes every query to it. A
// missing or malformed id means the gateway is broken, not that the user
// failed to authenticate, so it is PERMISSION_DENIED (masked by the gateway).
export const USER_ID_METADATA = "x-user-id";

export function userIdFrom(metadata: Metadata | undefined): UserId {
  const values = metadata?.get(USER_ID_METADATA) ?? [];
  const [userId] = values;
  if (
    values.length !== 1 ||
    typeof userId !== "string" ||
    !isObjectIdOrHexString(userId)
  ) {
    throw new errors.PermissionDeniedError(
      `expected one ObjectId in ${USER_ID_METADATA} metadata`,
    );
  }
  return toUserId(userId);
}
