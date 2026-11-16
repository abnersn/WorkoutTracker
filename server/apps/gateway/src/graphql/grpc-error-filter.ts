import { Catch } from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";
import { ThrottlerException } from "@nestjs/throttler";
import { GraphQLError } from "graphql";
import { isGrpcError, toGraphQLError } from "./to-graphql-error";

// The sign-in form shows the message as-is. Without this, Nest's Apollo
// driver has no code for HTTP 429 and sends INTERNAL_SERVER_ERROR with
// "ThrottlerException: Too Many Requests".
export const tooManyRequests = (): GraphQLError =>
  new GraphQLError("Too many attempts. Wait a minute, then try again.", {
    extensions: { code: "TOO_MANY_REQUESTS" },
  });

@Catch()
export class GrpcErrorFilter implements GqlExceptionFilter {
  catch(err: unknown): GraphQLError | unknown {
    if (err instanceof ThrottlerException) {
      return tooManyRequests();
    }
    return isGrpcError(err) ? toGraphQLError(err) : err;
  }
}
