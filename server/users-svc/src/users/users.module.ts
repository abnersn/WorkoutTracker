import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRecord, UserSchema } from "./user.schema";
import { UsersGrpcController } from "./users.grpc-controller";
import { UsersService } from "./users.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  type Env,
  InternalSecretGuard,
  validateEnv,
} from "@workout-tracker/helpers";

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
  providers: [
    UsersService,
    {
      // Rejects any call without the shared INTERNAL_SECRET.
      provide: APP_GUARD,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) =>
        new InternalSecretGuard(config.get("INTERNAL_SECRET")),
    },
  ],
})
export class UsersModule {}
