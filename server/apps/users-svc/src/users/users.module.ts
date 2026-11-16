import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRecord, UserSchema } from "./user.schema";
import { UsersGrpcController } from "./users.grpc-controller";
import { UsersService } from "./users.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { type Env, validateEnv } from "@workout-tracker/helpers";

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
    MongooseModule.forFeature([{ name: UserRecord.name, schema: UserSchema }]),
  ],
  controllers: [UsersGrpcController],
  // No auth guard: only the gateway's service account may invoke this service
  // (Cloud Run IAM), and locally it listens on loopback only.
  providers: [UsersService],
})
export class UsersModule {}
