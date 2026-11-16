import { UnauthorizedException } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { AuthUser, CurrentUser } from "../auth/current-user.decorator";
import { toUserGql, UserGql } from "./user.types";
import { UsersClient } from "./users.client";

@Resolver(() => UserGql)
export class UsersResolver {
  constructor(private readonly usersClient: UsersClient) {}

  @Query(() => UserGql)
  async me(@CurrentUser() user: AuthUser): Promise<UserGql> {
    const [found] = await this.usersClient.getUsers([user.id], user.id);
    if (!found) {
      throw new UnauthorizedException();
    }
    return toUserGql(found);
  }
}
