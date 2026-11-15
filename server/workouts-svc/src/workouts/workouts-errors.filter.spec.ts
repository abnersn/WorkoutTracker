import { status } from "@grpc/grpc-js";
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
    () => new MongooseError.DocumentNotFoundError("no document found for query"),
    status.NOT_FOUND,
  ],
];

describe("WorkoutsErrorsFilter", () => {
  const filter = new WorkoutsErrorsFilter();

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
