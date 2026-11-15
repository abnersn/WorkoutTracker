import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import {
  WORKOUTS_SERVICE_NAME,
  WORKOUTS_V1_PACKAGE_NAME,
  workoutsGrpcOptions,
} from "@workout-tracker/proto";
import { join } from "node:path";
import { Env } from "../app/env";
import { grpcCredentials } from "../app/grpc-credentials";
import { deadline } from "../app/grpc-deadline";
import { WORKOUTS_CLIENT, WorkoutsClient } from "./workouts.client";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: WORKOUTS_CLIENT,
        inject: [ConfigService],
        useFactory: (config: ConfigService<Env, true>) => {
          const url = config.get("WORKOUTS_GRPC_URL", { infer: true });
          return {
            transport: Transport.GRPC,
            options: {
              ...workoutsGrpcOptions(join(__dirname, "protos"), url),
              credentials: grpcCredentials(
                config.get("GRPC_AUTH", { infer: true }),
                url,
              ),
              channelOptions: deadline(
                `${WORKOUTS_V1_PACKAGE_NAME}.${WORKOUTS_SERVICE_NAME}`,
                5,
              ),
            },
          };
        },
      },
    ]),
  ],
  providers: [WorkoutsClient],
  exports: [WorkoutsClient],
})
export class WorkoutsClientModule {}
