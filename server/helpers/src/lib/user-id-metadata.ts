// The gateway authenticates the caller and forwards their id to services in
// this metadata key. Services trust it, since only the gateway can reach
// them: Cloud Run IAM when deployed, loopback-only listeners locally.
export const USER_ID_METADATA = "x-user-id";
