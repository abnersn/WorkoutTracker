import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { type Env, validateEnv } from "@workout-tracker/helpers";
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
  // No auth guard: only the gateway's service account may invoke this service
  // (Cloud Run IAM), and locally it listens on loopback only.
  providers: [WorkoutsService],
})
export class WorkoutsModule {}
