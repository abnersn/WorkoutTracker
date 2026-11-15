import * as argon2 from "argon2";
import { type Model } from "mongoose";
import { errors } from "@workout-tracker/helpers";
import { type UserRecord } from "./user.schema";
import { UsersService } from "./users.service";

const { EmailTakenError, InvalidCredentialError } = errors;

// Namespace imports can't be spied on, so wrap verify in a pass-through mock.
jest.mock("argon2", () => {
  const actual = jest.requireActual("argon2");
  return { ...actual, verify: jest.fn(actual.verify) };
});

const ID = "64b000000000000000000001";
const CREATED_AT = new Date("2026-01-02T03:04:05.678Z");

type FakeDoc = {
  id: string;
  email: string;
  displayName: string;
  passwordHash?: string;
  createdAt: Date;
};

const doc = (overrides: Partial<FakeDoc> = {}): FakeDoc => ({
  id: ID,
  email: "someone@example.com",
  displayName: "Someone",
  createdAt: CREATED_AT,
  ...overrides,
});

const expectedUser = {
  id: ID,
  email: "someone@example.com",
  displayName: "Someone",
  createdAt: { seconds: 1767323045, nanos: 678_000_000 },
};

function setup(): {
  service: UsersService;
  model: { create: jest.Mock; findOne: jest.Mock; find: jest.Mock };
  select: jest.Mock;
  findOneExec: jest.Mock;
  findExec: jest.Mock;
} {
  const findOneExec = jest.fn();
  const select = jest.fn(() => ({ exec: findOneExec }));
  const findExec = jest.fn();
  const model = {
    create: jest.fn(),
    findOne: jest.fn(() => ({ select })),
    find: jest.fn(() => ({ exec: findExec })),
  };
  const service = new UsersService(model as unknown as Model<UserRecord>);
  return { service, model, select, findOneExec, findExec };
}

describe("UsersService", () => {
  describe("createUser", () => {
    const input = {
      email: "  Someone@Example.COM ",
      password: "secret123",
      displayName: "Someone",
    };

    it("stores a normalized email and an argon2 hash, never the password", async () => {
      const { service, model } = setup();
      model.create.mockResolvedValue(doc());

      await expect(service.createUser(input)).resolves.toEqual(expectedUser);

      const saved = model.create.mock.calls[0][0];
      expect(saved).toEqual({
        email: "someone@example.com",
        displayName: "Someone",
        passwordHash: expect.stringMatching(/^\$argon2/),
      });
      expect(saved).not.toHaveProperty("password");
      await expect(
        argon2.verify(saved.passwordHash, "secret123"),
      ).resolves.toBe(true);
    });

    it("does not leak the password hash in the returned user", async () => {
      const { service, model } = setup();
      model.create.mockResolvedValue(doc({ passwordHash: "$argon2id$..." }));

      const user = await service.createUser(input);
      expect(user).not.toHaveProperty("passwordHash");
    });

    it("turns a duplicate key error (11000) into EmailTakenError", async () => {
      const { service, model } = setup();
      model.create.mockRejectedValue(
        Object.assign(new Error("E11000"), { code: 11000 }),
      );

      await expect(service.createUser(input)).rejects.toBeInstanceOf(
        EmailTakenError,
      );
    });

    it("rethrows any other database error unchanged", async () => {
      const { service, model } = setup();
      const dbError = new Error("connection lost");
      model.create.mockRejectedValue(dbError);

      await expect(service.createUser(input)).rejects.toBe(dbError);
    });
  });

  describe("verifyCredentials", () => {
    let passwordHash: string;
    beforeAll(async () => {
      passwordHash = await argon2.hash("secret123");
    });

    it("returns the user for the right password, looking up a normalized email", async () => {
      const { service, model, select, findOneExec } = setup();
      findOneExec.mockResolvedValue(doc({ passwordHash }));

      await expect(
        service.verifyCredentials(" SOMEONE@example.com", "secret123"),
      ).resolves.toEqual(expectedUser);
      expect(model.findOne).toHaveBeenCalledWith({
        email: "someone@example.com",
      });
      // passwordHash is select:false in the schema, so it must be opted in
      expect(select).toHaveBeenCalledWith("+passwordHash");
    });

    it("rejects a wrong password", async () => {
      const { service, findOneExec } = setup();
      findOneExec.mockResolvedValue(doc({ passwordHash }));

      await expect(
        service.verifyCredentials("someone@example.com", "wrong"),
      ).rejects.toBeInstanceOf(InvalidCredentialError);
    });

    it("rejects an unknown email with the same error, after still running argon2", async () => {
      const { service, findOneExec } = setup();
      findOneExec.mockResolvedValue(null);
      const verify = argon2.verify as jest.Mock;
      verify.mockClear();

      await expect(
        service.verifyCredentials("ghost@example.com", "secret123"),
      ).rejects.toBeInstanceOf(InvalidCredentialError);
      // the decoy hash keeps timing similar so emails can't be enumerated
      expect(verify).toHaveBeenCalledTimes(1);
    });

    it("rejects an unknown email even if the password matches the decoy", async () => {
      const { service, findOneExec } = setup();
      findOneExec.mockResolvedValue(null);

      await expect(
        service.verifyCredentials(
          "ghost@example.com",
          "no account has this password",
        ),
      ).rejects.toBeInstanceOf(InvalidCredentialError);
    });
  });

  describe("getUsers", () => {
    it("queries only valid ObjectIds and maps the results", async () => {
      const { service, model, findExec } = setup();
      findExec.mockResolvedValue([doc()]);

      await expect(service.getUsers([ID, "bogus", ""])).resolves.toEqual([
        expectedUser,
      ]);
      expect(model.find).toHaveBeenCalledWith({ _id: { $in: [ID] } });
    });

    it("returns an empty list when nothing matches", async () => {
      const { service, findExec } = setup();
      findExec.mockResolvedValue([]);

      await expect(service.getUsers(["bogus"])).resolves.toEqual([]);
    });
  });
});
