import { createServer } from "node:net";
import { join } from "node:path";
import { promisify } from "node:util";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { type INestMicroservice } from "@nestjs/common";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Test } from "@nestjs/testing";
import { protoLoaderOptions, usersGrpcOptions } from "@workout-tracker/proto";
import { Error as MongooseError } from "mongoose";
import { EmailTakenError, InvalidCredentialError } from "./errors";
import { UsersGrpcController } from "./users.grpc-controller";
import { UsersService } from "./users.service";

const PROTO_DIR = join(__dirname, "../../../proto/protos");

const user = {
  id: "64b000000000000000000001",
  email: "someone@example.com",
  displayName: "Someone",
  createdAt: { seconds: 1767323045, nanos: 678_000_000 },
};

async function freePort(): Promise<number> {
  const srv = createServer();
  await new Promise<void>((resolve) => srv.listen(0, "127.0.0.1", resolve));
  const { port } = srv.address() as { port: number };
  await new Promise((resolve) => srv.close(resolve));
  return port;
}

type Call = (req: object) => Promise<unknown>;
type Client = {
  createUser: Call;
  verifyCredentials: Call;
  getUsers: Call;
  close: () => void;
};

function makeClient(url: string): Client {
  const def = protoLoader.loadSync(join(PROTO_DIR, "users/v1/users.proto"), {
    ...protoLoaderOptions,
    includeDirs: [PROTO_DIR],
  });
  const pkg = grpc.loadPackageDefinition(def) as unknown as {
    users: { v1: { UsersService: grpc.ServiceClientConstructor } };
  };
  const raw = new pkg.users.v1.UsersService(
    url,
    grpc.credentials.createInsecure(),
  );
  const call = (name: string): Call => promisify(raw[name].bind(raw));
  return {
    createUser: call("CreateUser"),
    verifyCredentials: call("VerifyCredentials"),
    getUsers: call("GetUsers"),
    close: () => raw.close(),
  };
}

describe("UsersGrpcController (over gRPC)", () => {
  let app: INestMicroservice;
  let client: Client;
  const service = { create: jest.fn(), verify: jest.fn(), getMany: jest.fn() };

  beforeAll(async () => {
    const url = `127.0.0.1:${await freePort()}`;
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersGrpcController],
      providers: [{ provide: UsersService, useValue: service }],
    }).compile();
    app = moduleRef.createNestMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: usersGrpcOptions(PROTO_DIR, url),
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

  describe("CreateUser", () => {
    const req = {
      email: " Someone@Example.com ",
      password: "secret123",
      displayName: "Someone",
    };

    it("passes the validated, normalized request to the service", async () => {
      service.create.mockResolvedValue(user);

      await expect(client.createUser(req)).resolves.toEqual(user);
      expect(service.create).toHaveBeenCalledWith({
        email: "someone@example.com",
        password: "secret123",
        displayName: "Someone",
      });
    });

    it("returns INVALID_ARGUMENT without calling the service for bad input", async () => {
      await expect(
        client.createUser({ email: "", password: "", displayName: "" }),
      ).rejects.toMatchObject({
        code: grpc.status.INVALID_ARGUMENT,
        details: expect.stringContaining("email"),
      });
      expect(service.create).not.toHaveBeenCalled();
    });

    it("returns ALREADY_EXISTS when the email is taken", async () => {
      service.create.mockRejectedValue(new EmailTakenError());

      await expect(client.createUser(req)).rejects.toMatchObject({
        code: grpc.status.ALREADY_EXISTS,
        details: "That email is already registered",
      });
    });

    it("returns INVALID_ARGUMENT for a mongoose ValidationError", async () => {
      service.create.mockRejectedValue(new MongooseError.ValidationError());

      await expect(client.createUser(req)).rejects.toMatchObject({
        code: grpc.status.INVALID_ARGUMENT,
      });
    });

    it("does not leak details of unexpected errors", async () => {
      service.create.mockRejectedValue(
        new Error("connection string with secrets"),
      );

      const err = await client
        .createUser(req)
        .catch((e: grpc.ServiceError) => e);
      expect(err).toMatchObject({ code: expect.any(Number) });
      expect((err as grpc.ServiceError).details).not.toContain("secrets");
    });
  });

  describe("VerifyCredentials", () => {
    it("returns the user for valid credentials", async () => {
      service.verify.mockResolvedValue(user);

      await expect(
        client.verifyCredentials({
          email: "SOMEONE@example.com",
          password: "secret123",
        }),
      ).resolves.toEqual(user);
      expect(service.verify).toHaveBeenCalledWith(
        "someone@example.com",
        "secret123",
      );
    });

    it("returns UNAUTHENTICATED for bad credentials", async () => {
      service.verify.mockRejectedValue(new InvalidCredentialError());

      await expect(
        client.verifyCredentials({
          email: "someone@example.com",
          password: "nope",
        }),
      ).rejects.toMatchObject({
        code: grpc.status.UNAUTHENTICATED,
        details: "Invalid email or password",
      });
    });
  });

  describe("GetUsers", () => {
    it("wraps the service result in { users }", async () => {
      service.getMany.mockResolvedValue([user]);

      await expect(client.getUsers({ ids: [user.id] })).resolves.toEqual({
        users: [user],
      });
      expect(service.getMany).toHaveBeenCalledWith([user.id]);
    });

    it("rejects more than 100 ids", async () => {
      const ids = Array.from({ length: 101 }, (_, i) => String(i));

      await expect(client.getUsers({ ids })).rejects.toMatchObject({
        code: grpc.status.INVALID_ARGUMENT,
      });
      expect(service.getMany).not.toHaveBeenCalled();
    });
  });
});
