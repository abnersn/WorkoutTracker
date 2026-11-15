import { Catch, type RpcExceptionFilter } from "@nestjs/common";
import {
  EmailTakenError,
  InvalidArgumentError,
  InvalidCredentialError,
} from "./errors";
import { type Observable, throwError } from "rxjs";
import { status } from "@grpc/grpc-js";
import { Error as MongooseError } from "mongoose";

type ErrorClass = new (...args: never[]) => Error;
const codes = new Map<ErrorClass, status>([
  [EmailTakenError, status.ALREADY_EXISTS],
  [InvalidCredentialError, status.UNAUTHENTICATED],
  [InvalidArgumentError, status.INVALID_ARGUMENT],
  [MongooseError.ValidationError, status.INVALID_ARGUMENT],
]);

@Catch(
  EmailTakenError,
  InvalidCredentialError,
  InvalidArgumentError,
  MongooseError.ValidationError,
)
export class UsersErrorsFilter implements RpcExceptionFilter<Error> {
  catch(error: Error): Observable<never> {
    const code = codes.get(error.constructor as ErrorClass) ?? status.INTERNAL;
    return throwError(() => ({ code, message: error.message }));
  }
}
