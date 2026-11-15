import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  type Env,
  InternalSecretGuard,
  validateEnv,
} from "@workout-tracker/helpers";
import {
  LogEntryRecord,
  LogEntrySchema,
  WorkoutRecord,
  WorkoutSchema,
} from "./workout.schema";
import { WorkoutsGrpcController } from "./workouts.grpc-controller";
import { WorkoutsService } from "./workouts.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      validate: validateEnv,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        uri: config.get("MONGODB_URI"),
        maxPoolSize: config.get("MONGODB_MAX_POOL_SIZE"),
      }),
    }),
    MongooseModule.forFeature([
      { name: WorkoutRecord.name, schema: WorkoutSchema },
      { name: LogEntryRecord.name, schema: LogEntrySchema },
    ]),
  ],
  controllers: [WorkoutsGrpcController],
  providers: [
    WorkoutsService,
    {
      // Rejects any call without the shared INTERNAL_SECRET.
      provide: APP_GUARD,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) =>
        new InternalSecretGuard(config.get("INTERNAL_SECRET")),
    },
  ],
})
export class WorkoutsModule {}
