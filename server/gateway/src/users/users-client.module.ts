import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Env } from "../app/env";
import {
  USERS_SERVICE_NAME,
  USERS_V1_PACKAGE_NAME,
  usersGrpcOptions,
} from "@workout-tracker/proto";
import { join } from "node:path";
import { deadline } from "../app/grpc-deadline";
import { USERS_CLIENT, UsersClient } from "./users.client";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USERS_CLIENT,
        inject: [ConfigService],
        useFactory: (config: ConfigService<Env, true>) => ({
          transport: Transport.GRPC,
          options: {
            ...usersGrpcOptions(
              join(__dirname, "protos"),
              config.get("USERS_GRPC_URL", { infer: true }),
            ),
            channelOptions: deadline(
              `${USERS_V1_PACKAGE_NAME}.${USERS_SERVICE_NAME}`,
              5,
            ),
          },
        }),
      },
    ]),
  ],
  providers: [UsersClient],
  exports: [UsersClient],
})
export class UsersClientModule {}
