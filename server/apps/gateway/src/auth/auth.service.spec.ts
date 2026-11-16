import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import type { User } from "@workout-tracker/proto";
import { UsersClient } from "../users/users.client";
import { AuthService } from "./auth.service";

const firstUser: User = {
  id: "6736c2a1d4e5f60718293a4b",
  email: "user1@example.com",
  displayName: "First user",
  createdAt: { seconds: 1_767_225_600, nanos: 0 },
};

describe("AuthService", () => {
  let auth: AuthService;
  let jwt: JwtService;

  const users = {
    createUser: async (): Promise<User> => firstUser,
    verifyCredentials: async (): Promise<User> => firstUser,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: "unit-test-secret" })],
      providers: [AuthService, { provide: UsersClient, useValue: users }],
    }).compile();
    auth = moduleRef.get(AuthService);
    jwt = moduleRef.get(JwtService);
  });

  it("signs a token for the user users-svc returns", async () => {
    const input = { email: firstUser.email, password: "any-password" };
    const { token, user } = await auth.signIn(input);
    expect(jwt.verify(token).sub).toBe(firstUser.id);
    expect(user.createdAt).toEqual(new Date("2026-01-01T00:00:00Z"));
  });

  it("lets a users-svc failure through", async () => {
    const failure = Object.assign(new Error("16 UNAUTHENTICATED"), {
      code: 16,
    });
    users.verifyCredentials = async () => {
      throw failure;
    };
    const input = { email: firstUser.email, password: "wrong-password" };
    await expect(auth.signIn(input)).rejects.toBe(failure);
  });
});
