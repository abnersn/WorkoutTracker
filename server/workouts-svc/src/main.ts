import { NestFactory } from "@nestjs/core";
import { WorkoutsModule } from "./workouts/workouts.module";
import {
  type AsyncMicroserviceOptions,
  Transport,
} from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { type Env } from "@workout-tracker/helpers";
import { workoutsGrpcOptions } from "@workout-tracker/proto";
import { join } from "node:path";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    WorkoutsModule,
    {
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        transport: Transport.GRPC,
        options: {
          ...workoutsGrpcOptions(
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
