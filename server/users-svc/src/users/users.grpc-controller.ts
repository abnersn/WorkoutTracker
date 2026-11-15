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
import { type UsersService } from "./users.service";
import { UsersErrorsFilter } from "./user-errors.filter";

@Controller()
@UsersServiceControllerMethods()
@UseFilters(UsersErrorsFilter)
export class UsersGrpcController implements UsersServiceController {
  constructor(private readonly users: UsersService) {}

  createUser(req: CreateUserRequest): Promise<User> {
    return this.users.create(req);
  }

  verifyCredentials(req: VerifyCredentialsRequest): Promise<User> {
    return this.users.verify(req.email, req.password);
  }

  async getUsers(req: GetUsersRequest): Promise<GetUsersResponse> {
    return { users: await this.users.getMany(req.ids) };
  }
}
