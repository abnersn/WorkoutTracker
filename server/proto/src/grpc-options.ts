import { join } from "node:path";
import type { GrpcOptions } from "@nestjs/microservices";
import { USERS_V1_PACKAGE_NAME } from "./generated/users/v1/users";
import { WORKOUTS_V1_PACKAGE_NAME } from "./generated/workouts/v1/workouts";
import { protoLoaderOptions } from "./loader";
export type GrpcConnectionOptions = GrpcOptions["options"];

export function workoutsGrpcOptions(
  protoDir: string,
  url: string,
): GrpcConnectionOptions {
  return {
    package: WORKOUTS_V1_PACKAGE_NAME,
    protoPath: [join(protoDir, "workouts/v1/workouts.proto")],
    url,
    loader: { ...protoLoaderOptions, includeDirs: [protoDir] },
  };
}

export function usersGrpcOptions(
  protoDir: string,
  url: string,
): GrpcConnectionOptions {
  return {
    package: USERS_V1_PACKAGE_NAME,
    protoPath: [join(protoDir, "users/v1/users.proto")],
    url,
    loader: { ...protoLoaderOptions, includeDirs: [protoDir] },
  };
}
