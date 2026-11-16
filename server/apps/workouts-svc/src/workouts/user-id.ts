import type { Metadata } from "@grpc/grpc-js";
import { errors, USER_ID_METADATA } from "@workout-tracker/helpers";
import { toUserId, type UserId } from "./ids";
import { isObjectIdOrHexString } from "mongoose";

// workouts-svc scopes every query to the id the gateway forwards in
// USER_ID_METADATA. A missing or malformed id means the gateway is broken,
// not that the user failed to authenticate, so it is PERMISSION_DENIED
// (masked by the gateway).
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
