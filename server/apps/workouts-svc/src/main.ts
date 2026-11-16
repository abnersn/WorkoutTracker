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
  // Set when Nx waits for this server to be ready
  if (process.env.NX_READY_SIGNAL_SOCKET) {
    try {
      // Function keeps TypeScript and bundlers from rewriting or bundling the import
      const load = new Function("s", "return import(s)") as (
        s: string,
      ) => Promise<{ emitReadySignal(server?: unknown): boolean }>;
      (await load("@nx/js/ready-signal")).emitReadySignal();
    } catch {
      // @nx/js isn't installed
    }
  }
}

bootstrap();
