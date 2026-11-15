import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthPayload, SignInInput, SignUpInput } from "./auth.types";
import { GqlThrottlerGuard } from "./gql-throttler.guard";
import { Public } from "./public.decorator";

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @UseGuards(GqlThrottlerGuard)
  @Mutation(() => AuthPayload)
  async signUp(@Args("input") input: SignUpInput): Promise<AuthPayload> {
    return this.auth.signUp(input);
  }

  @Public()
  @UseGuards(GqlThrottlerGuard)
  @Mutation(() => AuthPayload)
  signIn(@Args("input") input: SignInInput): Promise<AuthPayload> {
    return this.auth.signIn(input);
  }
}
