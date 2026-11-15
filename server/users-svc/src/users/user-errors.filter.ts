import { status } from "@grpc/grpc-js";
import { Catch, type RpcExceptionFilter } from "@nestjs/common";
import { errors } from "@workout-tracker/helpers";
import { Error as MongooseError } from "mongoose";
import { type Observable, throwError } from "rxjs";

type ErrorClass = new (...args: never[]) => Error;
const codes = new Map<ErrorClass, status>([
  [errors.EmailTakenError, status.ALREADY_EXISTS],
  [errors.InvalidCredentialError, status.UNAUTHENTICATED],
  [errors.UnauthenticatedError, status.UNAUTHENTICATED],
  [errors.PermissionDeniedError, status.PERMISSION_DENIED],
  [errors.InvalidArgumentError, status.INVALID_ARGUMENT],
  [MongooseError.ValidationError, status.INVALID_ARGUMENT],
]);

// Derived from the map so a mapped class can't be left out of @Catch.
@Catch(...codes.keys())
export class UsersErrorsFilter implements RpcExceptionFilter<Error> {
  catch(error: Error): Observable<never> {
    const code = codes.get(error.constructor as ErrorClass) ?? status.INTERNAL;
    return throwError(() => ({ code, message: error.message }));
  }
}
