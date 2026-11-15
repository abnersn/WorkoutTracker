import { Field, InputType, ObjectType } from "@nestjs/graphql";

import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from "class-validator";

import { UserGql } from "../users/user.types";

@ObjectType()
export class AuthPayload {
  @Field() token!: string;
  @Field(() => UserGql) user!: UserGql;
}

@InputType()
export class SignUpInput {
  @Field() @IsEmail() @MaxLength(254) email!: string;
  @Field() @IsString() @MinLength(8) @MaxLength(128) password!: string;
  @Field() @IsString() @Length(1, 60) displayName!: string;
}

@InputType()
export class SignInInput {
  @Field() @IsEmail() @MaxLength(254) email!: string;
  @Field() @IsString() @MaxLength(128) password!: string;
}
