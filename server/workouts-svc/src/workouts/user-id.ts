import type { Metadata } from "@grpc/grpc-js";
import { errors, toUserId, type UserId } from "@workout-tracker/helpers";
import { isObjectIdOrHexString } from "mongoose";

// The gateway authenticates the caller and forwards their id in this
// metadata key; workouts-svc trusts it and scopes every query to it.
export const USER_ID_METADATA = "x-user-id";

export function userIdFrom(metadata: Metadata | undefined): UserId {
  const values = metadata?.get(USER_ID_METADATA) ?? [];
  const [userId] = values;
  if (
    values.length !== 1 ||
    typeof userId !== "string" ||
    !isObjectIdOrHexString(userId)
  ) {
    throw new errors.UnauthenticatedError(
      `expected one ObjectId in ${USER_ID_METADATA} metadata`,
    );
  }
  return toUserId(userId);
}
