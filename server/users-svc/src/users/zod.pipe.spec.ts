import { InvalidArgumentError } from "./errors";
import {
  createUserSchema,
  getUsersSchema,
  verifyCredentialsSchema,
} from "./users.grpc-controller";
import { ZodPipe } from "./zod.pipe";

describe("ZodPipe", () => {
  describe("with createUserSchema", () => {
    const pipe = new ZodPipe(createUserSchema);
    const valid = {
      email: "  Someone@Example.COM ",
      password: "secret123",
      displayName: "  Someone  ",
    };

    it("returns the parsed, normalized value", () => {
      expect(pipe.transform(valid)).toEqual({
        email: "someone@example.com",
        password: "secret123",
        displayName: "Someone",
      });
    });

    it("does not trim the password", () => {
      expect(
        pipe.transform({ ...valid, password: " secret123 " }).password,
      ).toBe(" secret123 ");
    });

    it("strips unknown fields", () => {
      expect(pipe.transform({ ...valid, isAdmin: true })).not.toHaveProperty(
        "isAdmin",
      );
    });

    it.each([
      ["an invalid email", { email: "not-an-email" }, "email"],
      // proto3 sends missing strings as "", so "" must fail as "required"
      ["an empty email", { email: "" }, "email"],
      ["a short password", { password: "1234567" }, "password"],
      ["a password over 128 chars", { password: "x".repeat(129) }, "password"],
      ["a blank display name", { displayName: "   " }, "displayName"],
      [
        "a display name over 60 chars",
        { displayName: "x".repeat(61) },
        "displayName",
      ],
    ])(
      "rejects %s with an InvalidArgumentError naming the field",
      (_, patch, field) => {
        const run = (): unknown => pipe.transform({ ...valid, ...patch });
        expect(run).toThrow(InvalidArgumentError);
        expect(run).toThrow(field);
      },
    );

    it("rejects a non-object payload", () => {
      expect(() => pipe.transform(null)).toThrow(InvalidArgumentError);
    });
  });

  describe("with verifyCredentialsSchema", () => {
    const pipe = new ZodPipe(verifyCredentialsSchema);

    it("accepts any non-empty password (no length policy on login)", () => {
      expect(pipe.transform({ email: "a@b.co", password: "x" })).toEqual({
        email: "a@b.co",
        password: "x",
      });
    });

    it("rejects an empty password", () => {
      expect(() => pipe.transform({ email: "a@b.co", password: "" })).toThrow(
        InvalidArgumentError,
      );
    });
  });

  describe("with getUsersSchema", () => {
    const pipe = new ZodPipe(getUsersSchema);

    it("accepts an empty list", () => {
      expect(pipe.transform({ ids: [] })).toEqual({ ids: [] });
    });

    it("accepts 100 ids and rejects 101", () => {
      const ids = (n: number): string[] => Array.from({ length: n }, String);
      expect(pipe.transform({ ids: ids(100) }).ids).toHaveLength(100);
      expect(() => pipe.transform({ ids: ids(101) })).toThrow(
        InvalidArgumentError,
      );
    });
  });
});
