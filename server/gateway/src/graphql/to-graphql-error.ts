// Converts an RPC error into a graphql error

import { status } from "@grpc/grpc-js";
import { Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";

export interface GrpcError {
  code: number;
  details: string;
}

export const isGrpcError = (e: unknown): e is GrpcError =>
  typeof e === "object" &&
  e !== null &&
  typeof (e as GrpcError).code == "number" &&
  typeof (e as GrpcError).details === "string";

// The statuses whose message was written for the caller.
const PUBLIC_CODES: Partial<Record<number, string>> = {
  [status.INVALID_ARGUMENT]: "BAD_USER_INPUT",
  [status.NOT_FOUND]: "NOT_FOUND",
  [status.ALREADY_EXISTS]: "CONFLICT",
  [status.UNAUTHENTICATED]: "UNAUTHENTICATED",
  [status.FAILED_PRECONDITION]: "FAILED_PRECONDITION",
};

const logger = new Logger("GrpcErrors");

export function toGraphQLError(err: GrpcError): GraphQLError {
  const code = PUBLIC_CODES[err.code];
  if (code) {
    return new GraphQLError(err.details, { extensions: { code } });
  }
  logger.error(`gRPC ${status[err.code]}: ${err.details}`);
  return new GraphQLError("Something went wrong", {
    extensions: { code: "INTERNAL_SERVER_ERROR" },
  });
}
