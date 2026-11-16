import { Field, ID, ObjectType } from "@nestjs/graphql";
import { toDate, type User } from "@workout-tracker/proto";

@ObjectType("User")
export class UserGql {
  @Field(() => ID) id!: string;
  @Field() email!: string;
  @Field() displayName!: string;
  @Field() createdAt!: Date;
}

export const toUserGql = (u: User): UserGql => ({
  id: u.id,
  email: u.email,
  displayName: u.displayName,
  createdAt: toDate(u.createdAt),
});
