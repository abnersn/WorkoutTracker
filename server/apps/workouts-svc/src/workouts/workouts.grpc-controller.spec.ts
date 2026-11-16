import { createServer } from "node:net";
import { join } from "node:path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { type INestMicroservice } from "@nestjs/common";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Test } from "@nestjs/testing";
import {
  protoLoaderOptions,
  workoutsGrpcOptions,
} from "@workout-tracker/proto";
import { errors, USER_ID_METADATA } from "@workout-tracker/helpers";
import { toLogId, toUserId, toWorkoutId } from "./ids";
import { WorkoutsGrpcController } from "./workouts.grpc-controller";
import { WorkoutsService } from "./workouts.service";

const PROTO_DIR = join(__dirname, "../../../../libs/proto/protos");
const USER_ID = "64b000000000000000000001";
const WORKOUT_ID = "64b0000000000000000000aa";

const workout = {
  id: WORKOUT_ID,
  name: "Push day",
  date: { seconds: 1767323045, nanos: 0 },
  duration: 0,
  isComplete: false,
  exercises: [],
};

async function freePort(): Promise<number> {
  const srv = createServer();
  await new Promise<void>((resolve) => srv.listen(0, "127.0.0.1", resolve));
  const { port } = srv.address() as { port: number };
  await new Promise((resolve) => srv.close(resolve));
  return port;
}

type Call = (req: object, metadata?: grpc.Metadata) => Promise<unknown>;
type Client = { call: (name: string) => Call; close: () => void };

function makeClient(url: string): Client {
  const def = protoLoader.loadSync(
    join(PROTO_DIR, "workouts/v1/workouts.proto"),
    { ...protoLoaderOptions, includeDirs: [PROTO_DIR] },
  );
  const pkg = grpc.loadPackageDefinition(def) as unknown as {
    workouts: { v1: { WorkoutsService: grpc.ServiceClientConstructor } };
  };
  const raw = new pkg.workouts.v1.WorkoutsService(
    url,
    grpc.credentials.createInsecure(),
  );
  return {
    call:
      (name) =>
      (req, metadata = new grpc.Metadata()) =>
        new Promise((resolve, reject) =>
          raw[name].call(
            raw,
            req,
            metadata,
            (err: grpc.ServiceError | null, res: unknown) =>
              err ? reject(err) : resolve(res),
          ),
        ),
    close: () => raw.close(),
  };
}

// What the gateway sends: the caller's id.
function asUser(...ids: string[]): grpc.Metadata {
  const metadata = new grpc.Metadata();
  for (const id of ids) {
    metadata.add(USER_ID_METADATA, id);
  }
  return metadata;
}

describe("WorkoutsGrpcController (over gRPC)", () => {
  let app: INestMicroservice;
  let client: Client;
  const service = {
    listWorkouts: jest.fn(),
    getWorkout: jest.fn(),
    createWorkout: jest.fn(),
    updateWorkout: jest.fn(),
    deleteWorkout: jest.fn(),
    listLogs: jest.fn(),
    getLog: jest.fn(),
    createLog: jest.fn(),
    updateLog: jest.fn(),
    deleteLog: jest.fn(),
    getLastRuns: jest.fn(),
    getPreviousRun: jest.fn(),
  };

  beforeAll(async () => {
    const url = `127.0.0.1:${await freePort()}`;
    const moduleRef = await Test.createTestingModule({
      controllers: [WorkoutsGrpcController],
      providers: [{ provide: WorkoutsService, useValue: service }],
    }).compile();
    app = moduleRef.createNestMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: workoutsGrpcOptions(PROTO_DIR, url),
    });
    app.useLogger(false);
    await app.listen();
    client = makeClient(url);
  });

  afterAll(async () => {
    client?.close();
    await app?.close();
  });

  beforeEach(() => jest.resetAllMocks());

  describe(`${USER_ID_METADATA} metadata`, () => {
    it("passes the caller's id to the service on a list call", async () => {
      service.listWorkouts.mockResolvedValue([workout]);

      const res = await client.call("ListWorkouts")({}, asUser(USER_ID));

      expect(service.listWorkouts).toHaveBeenCalledWith(toUserId(USER_ID));
      expect(res).toMatchObject({ workouts: [{ id: WORKOUT_ID }] });
    });

    it("passes the caller's id alongside the payload", async () => {
      service.getWorkout.mockResolvedValue(workout);

      await client.call("GetWorkout")({ id: WORKOUT_ID }, asUser(USER_ID));

      expect(service.getWorkout).toHaveBeenCalledWith(
        toUserId(USER_ID),
        toWorkoutId(WORKOUT_ID),
      );
    });

    it.each([
      ["missing", asUser()],
      ["not an ObjectId", asUser("someone")],
      ["sent twice", asUser(USER_ID, USER_ID)],
    ])("returns PERMISSION_DENIED when it is %s", async (_, metadata) => {
      const err = await client
        .call("ListLogs")({}, metadata)
        .catch((e: grpc.ServiceError) => e);

      expect((err as grpc.ServiceError).code).toBe(
        grpc.status.PERMISSION_DENIED,
      );
      expect(service.listLogs).not.toHaveBeenCalled();
    });
  });

  it("returns NOT_FOUND for another user's workout", async () => {
    service.getWorkout.mockRejectedValue(
      new errors.NotFoundError(`workout ${WORKOUT_ID} not found`),
    );

    const err = await client
      .call("GetWorkout")({ id: WORKOUT_ID }, asUser(USER_ID))
      .catch((e: grpc.ServiceError) => e);

    expect((err as grpc.ServiceError).code).toBe(grpc.status.NOT_FOUND);
  });

  it("returns INVALID_ARGUMENT for a bad payload before reading the user", async () => {
    const err = await client
      .call("GetWorkout")({ id: "nope" }, asUser(USER_ID))
      .catch((e: grpc.ServiceError) => e);

    expect((err as grpc.ServiceError).code).toBe(grpc.status.INVALID_ARGUMENT);
    expect(service.getWorkout).not.toHaveBeenCalled();
  });

  describe("GetLastRuns", () => {
    const OTHER_ID = "64b0000000000000000000bb";

    it("passes typed ids through and returns each workout's last run", async () => {
      service.getLastRuns.mockResolvedValue([
        { workoutId: WORKOUT_ID, lastRunAt: { seconds: 1767323045, nanos: 0 } },
      ]);

      const res = await client.call("GetLastRuns")(
        { workoutIds: [WORKOUT_ID, OTHER_ID] },
        asUser(USER_ID),
      );

      expect(service.getLastRuns).toHaveBeenCalledWith(toUserId(USER_ID), [
        toWorkoutId(WORKOUT_ID),
        toWorkoutId(OTHER_ID),
      ]);
      expect(res).toEqual({
        lastRuns: [
          {
            workoutId: WORKOUT_ID,
            lastRunAt: { seconds: 1767323045, nanos: 0 },
          },
        ],
      });
    });

    it.each([
      ["a malformed id", ["nope"]],
      ["more than 100 ids", Array.from({ length: 101 }, () => WORKOUT_ID)],
    ])("returns INVALID_ARGUMENT for %s", async (_, workoutIds) => {
      const err = await client
        .call("GetLastRuns")({ workoutIds }, asUser(USER_ID))
        .catch((e: grpc.ServiceError) => e);

      expect((err as grpc.ServiceError).code).toBe(
        grpc.status.INVALID_ARGUMENT,
      );
      expect(service.getLastRuns).not.toHaveBeenCalled();
    });
  });

  describe("GetPreviousRun", () => {
    const LOG_ID = "64b0000000000000000000cc";

    it("returns the previous run", async () => {
      service.getPreviousRun.mockResolvedValue({
        ...workout,
        id: "64b0000000000000000000dd",
        workoutId: WORKOUT_ID,
      });
      const res = await client.call("GetPreviousRun")(
        { logId: LOG_ID },
        asUser(USER_ID),
      );
      expect(service.getPreviousRun).toHaveBeenCalledWith(
        toUserId(USER_ID),
        toLogId(LOG_ID),
      );
      expect(res).toMatchObject({
        log: { id: "64b0000000000000000000dd", workoutId: WORKOUT_ID },
      });
    });

    it("leaves log unset for a first run", async () => {
      service.getPreviousRun.mockResolvedValue(undefined);
      const res = await client.call("GetPreviousRun")(
        { logId: LOG_ID },
        asUser(USER_ID),
      );
      expect(res).toEqual({ log: null });
    });

    it("returns INVALID_ARGUMENT for a malformed id", async () => {
      const err = await client
        .call("GetPreviousRun")({ logId: "nope" }, asUser(USER_ID))
        .catch((e: grpc.ServiceError) => e);
      expect((err as grpc.ServiceError).code).toBe(
        grpc.status.INVALID_ARGUMENT,
      );
      expect(service.getPreviousRun).not.toHaveBeenCalled();
    });
  });
});
