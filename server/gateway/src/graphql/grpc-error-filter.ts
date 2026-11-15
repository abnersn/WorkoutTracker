import { Catch } from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { isGrpcError, toGraphQLError } from "./to-graphql-error";

@Catch()
export class GrpcErrorFilter implements GqlExceptionFilter {
  catch(err: unknown): GraphQLError | unknown {
    return isGrpcError(err) ? toGraphQLError(err) : err;
  }
}
