import { status } from "@grpc/grpc-js";
import { FILTER_CATCH_EXCEPTIONS } from "@nestjs/common/constants";
import { Error as MongooseError } from "mongoose";
import { firstValueFrom } from "rxjs";
import {
  EmailTakenError,
  InvalidArgumentError,
  InvalidCredentialError,
} from "./errors";
import { UsersErrorsFilter } from "./user-errors.filter";

function validationError(): MongooseError.ValidationError {
  const err = new MongooseError.ValidationError();
  err.addError(
    "email",
    new MongooseError.ValidatorError({ message: "Path `email` is required.", path: "email" }),
  );
  return err;
}

const cases: [string, () => Error, status][] = [
  ["EmailTakenError", () => new EmailTakenError(), status.ALREADY_EXISTS],
  ["InvalidCredentialError", () => new InvalidCredentialError(), status.UNAUTHENTICATED],
  ["InvalidArgumentError", () => new InvalidArgumentError("email: bad"), status.INVALID_ARGUMENT],
  ["mongoose ValidationError", validationError, status.INVALID_ARGUMENT],
];

describe("UsersErrorsFilter", () => {
  const filter = new UsersErrorsFilter();

  it.each(cases)("maps %s to gRPC code %s", async (_, make, code) => {
    const error = make();
    await expect(firstValueFrom(filter.catch(error))).rejects.toEqual({
      code,
      message: error.message,
    });
  });

  it("falls back to INTERNAL for an unmapped error", async () => {
    await expect(firstValueFrom(filter.catch(new Error("boom")))).rejects.toEqual({
      code: status.INTERNAL,
      message: "boom",
    });
  });

  // @Catch decides which errors reach the filter at all; a class in the
  // code map but missing here is never mapped at runtime.
  it.each(cases)("is registered with @Catch for %s", (_, make) => {
    const caught: unknown[] =
      Reflect.getMetadata(FILTER_CATCH_EXCEPTIONS, UsersErrorsFilter) ?? [];
    expect(caught).toContain(make().constructor);
  });
});
