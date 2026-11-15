import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@workout-tracker/proto";
import { toUserGql } from "../users/user.types";
import { UsersClient } from "../users/users.client";
import { AuthPayload, SignInInput, SignUpInput } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersClient,
    private readonly jwt: JwtService,
  ) {}

  async signUp(input: SignUpInput): Promise<AuthPayload> {
    return this.issue(await this.users.createUser(input));
  }

  async signIn({ email, password }: SignInInput): Promise<AuthPayload> {
    return this.issue(await this.users.verifyCredentials(email, password));
  }

  private async issue(user: User): Promise<AuthPayload> {
    const token = await this.jwt.signAsync({ sub: user.id });
    return { token, user: toUserGql(user) };
  }
}
