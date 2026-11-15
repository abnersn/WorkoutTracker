import { Controller, UseFilters } from "@nestjs/common";
import {
  type CreateUserRequest,
  type GetUsersRequest,
  type GetUsersResponse,
  type User,
  type UsersServiceController,
  UsersServiceControllerMethods,
  type VerifyCredentialsRequest,
} from "@workout-tracker/proto";
import { UsersService } from "./users.service";
import { UsersErrorsFilter } from "./user-errors.filter";
import { Payload } from "@nestjs/microservices";
import { z } from "zod";
import { ZodPipe } from "@workout-tracker/helpers";

const email = z.string().trim().toLowerCase().pipe(z.email());

export const createUserSchema = z.object({
  email,
  password: z.string().min(8).max(128), // the max limits argon2 work
  displayName: z.string().trim().min(1).max(60),
});

export const verifyCredentialsSchema = z.object({
  email,
  password: z.string().min(1).max(128),
});

export const getUsersSchema = z.object({
  ids: z.array(z.string()).max(100),
});

@Controller()
@UsersServiceControllerMethods()
@UseFilters(UsersErrorsFilter)
export class UsersGrpcController implements UsersServiceController {
  constructor(private readonly users: UsersService) {}

  createUser(
    @Payload(new ZodPipe(createUserSchema))
    req: CreateUserRequest,
  ): Promise<User> {
    return this.users.createUser(req);
  }

  verifyCredentials(
    @Payload(new ZodPipe(verifyCredentialsSchema))
    req: VerifyCredentialsRequest,
  ): Promise<User> {
    return this.users.verifyCredentials(req.email, req.password);
  }

  async getUsers(
    @Payload(new ZodPipe(getUsersSchema)) req: GetUsersRequest,
  ): Promise<GetUsersResponse> {
    return { users: await this.users.getUsers(req.ids) };
  }
}
