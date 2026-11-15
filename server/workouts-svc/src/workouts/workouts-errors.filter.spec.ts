import { status } from "@grpc/grpc-js";
import { FILTER_CATCH_EXCEPTIONS } from "@nestjs/common/constants";
import { errors } from "@workout-tracker/helpers";
import { Error as MongooseError, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import { WorkoutsErrorsFilter } from "./workouts-errors.filter";

const doc = { _doc: { _id: new Types.ObjectId() } } as never;

const cases: [string, () => Error, status][] = [
  ["NotFoundError", () => new errors.NotFoundError("gone"), status.NOT_FOUND],
  [
    "UnauthenticatedError",
    () => new errors.UnauthenticatedError("who?"),
    status.UNAUTHENTICATED,
  ],
  [
    "PermissionDeniedError",
    () => new errors.PermissionDeniedError("no"),
    status.PERMISSION_DENIED,
  ],
  [
    "InvalidArgumentError",
    () => new errors.InvalidArgumentError("bad"),
    status.INVALID_ARGUMENT,
  ],
  [
    "mongoose ValidationError",
    () => new MongooseError.ValidationError(),
    status.INVALID_ARGUMENT,
  ],
  [
    "mongoose VersionError",
    () => new MongooseError.VersionError(doc, 1, []),
    status.ABORTED,
  ],
  [
    "mongoose DocumentNotFoundError",
    () =>
      new MongooseError.DocumentNotFoundError("no document found for query"),
    status.NOT_FOUND,
  ],
];

describe("WorkoutsErrorsFilter", () => {
  const filter = new WorkoutsErrorsFilter();

  // @Catch decides which errors reach the filter at all; a class in the
  // code map but missing here is never mapped at runtime.
  it.each(cases)("is registered with @Catch for %s", (_, make) => {
    const caught: unknown[] =
      Reflect.getMetadata(FILTER_CATCH_EXCEPTIONS, WorkoutsErrorsFilter) ?? [];
    expect(caught).toContain(make().constructor);
  });

  it.each(cases)("maps %s to gRPC code %s", async (_, make, code) => {
    const error = make();
    await expect(firstValueFrom(filter.catch(error))).rejects.toEqual({
      code,
      message: error.message,
    });
  });

  it("falls back to INTERNAL for an unmapped error", async () => {
    await expect(
      firstValueFrom(filter.catch(new Error("boom"))),
    ).rejects.toEqual({ code: status.INTERNAL, message: "boom" });
  });
});
