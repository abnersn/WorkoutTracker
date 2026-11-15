import { Catch, type RpcExceptionFilter } from "@nestjs/common";
import { errors } from "@workout-tracker/helpers";
import { type Observable, throwError } from "rxjs";
import { status } from "@grpc/grpc-js";
import { Error as MongooseError } from "mongoose";

type ErrorClass = new (...args: never[]) => Error;
const codes = new Map<ErrorClass, status>([
  [errors.NotFoundError, status.NOT_FOUND],
  [errors.UnauthenticatedError, status.UNAUTHENTICATED],
  [errors.InvalidArgumentError, status.INVALID_ARGUMENT],
  [MongooseError.ValidationError, status.INVALID_ARGUMENT],
]);

@Catch(
  errors.NotFoundError,
  errors.UnauthenticatedError,
  errors.InvalidArgumentError,
  MongooseError.ValidationError,
)
export class WorkoutsErrorsFilter implements RpcExceptionFilter<Error> {
  catch(error: Error): Observable<never> {
    const code = codes.get(error.constructor as ErrorClass) ?? status.INTERNAL;
    return throwError(() => ({ code, message: error.message }));
  }
}
