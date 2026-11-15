import { Metadata } from "@grpc/grpc-js";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientGrpc } from "@nestjs/microservices";
import { INTERNAL_SECRET_METADATA } from "@workout-tracker/helpers";
import {
  CreateUserRequest,
  User,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from "@workout-tracker/proto";
import { firstValueFrom } from "rxjs";
import { Env } from "../app/env";

export const USERS_CLIENT = Symbol("USERS_CLIENT");

@Injectable()
export class UsersClient implements OnModuleInit {
  private svc!: UsersServiceClient;
  private readonly secret: string;

  constructor(
    @Inject(USERS_CLIENT)
    private readonly grpc: ClientGrpc,
    config: ConfigService<Env, true>,
  ) {
    this.secret = config.get("INTERNAL_SECRET", { infer: true });
  }

  private metadata(userId?: string): Metadata {
    const md = new Metadata();
    md.set(INTERNAL_SECRET_METADATA, this.secret);
    if (userId) {
      md.set("x-user-id", userId);
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
