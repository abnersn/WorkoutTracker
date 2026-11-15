import { Metadata } from "@grpc/grpc-js";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { USER_ID_METADATA } from "@workout-tracker/helpers";
import {
  CreateUserRequest,
  User,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from "@workout-tracker/proto";
import { firstValueFrom } from "rxjs";

export const USERS_CLIENT = Symbol("USERS_CLIENT");

@Injectable()
export class UsersClient implements OnModuleInit {
  private svc!: UsersServiceClient;

  constructor(
    @Inject(USERS_CLIENT)
    private readonly grpc: ClientGrpc,
  ) {}

  private metadata(userId?: string): Metadata {
    const md = new Metadata();
    if (userId) {
      md.set(USER_ID_METADATA, userId);
    }
    return md;
  }

  onModuleInit(): void {
    this.svc = this.grpc.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  createUser(input: CreateUserRequest): Promise<User> {
    return firstValueFrom(this.svc.createUser(input, this.metadata()));
  }

  verifyCredentials(email: string, password: string): Promise<User> {
    return firstValueFrom(
      this.svc.verifyCredentials(
        {
          email,
          password,
        },
        this.metadata(),
      ),
    );
  }

  async getUsers(ids: string[], userId?: string): Promise<User[]> {
    const res = await firstValueFrom(
      this.svc.getUsers({ ids }, this.metadata(userId)),
    );
    return res.users;
  }
}
