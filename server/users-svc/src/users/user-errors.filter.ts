import { Catch, RpcExceptionFilter } from "@nestjs/common";
import { EmailTakenError, InvalidCredentialError } from "./errors";
import { Observable, throwError } from "rxjs";
import { status } from "@grpc/grpc-js";

@Catch(EmailTakenError, InvalidCredentialError)
export class UsersErrorsFilter implements RpcExceptionFilter<Error> {
  catch(error: Error): Observable<never> {
    const code =
      error instanceof EmailTakenError
        ? status.ALREADY_EXISTS
        : status.UNAUTHENTICATED;
    return throwError(() => ({ code, message: error.message }));
  }
}
