import { NestFactory } from "@nestjs/core";
import { UsersModule } from "./users/users.module";
import {
  type AsyncMicroserviceOptions,
  Transport,
} from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { type Env } from "./users/env";
import { usersGrpcOptions } from "@workout-tracker/proto";
import { join } from "node:path";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    UsersModule,
    {
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        transport: Transport.GRPC,
        options: {
          ...usersGrpcOptions(
            join(__dirname, "protos"),
            config.get("GRPC_URL"),
          ),
        },
      }),
    },
  );
  app.enableShutdownHooks();
  await app.listen();
}

bootstrap();
