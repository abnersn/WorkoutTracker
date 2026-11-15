import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import type { Request, Response } from "express";
import { join } from "node:path";
import { AuthModule } from "../auth/auth.module";
import { GrpcErrorFilter } from "../graphql/grpc-error-filter";
import { toValidationGraphQLError } from "../graphql/validation-error";
import { UsersModule } from "../users/users.module";
import { WorkoutsModule } from "../workouts/workouts.module";
import { type Env, validateEnv } from "./env";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      validate: validateEnv,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => {
        const appEnv = config.get("APP_ENV", { infer: true });
        // Introspection and the Sandbox stay on in staging for debugging.
        const exposeTooling = appEnv !== "production";
        return {
          // Only a local dev run rewrites the committed schema file.
          autoSchemaFile:
            appEnv === "development"
              ? join(process.cwd(), "server/gateway/src/schema.gql")
              : true,
          sortSchema: true,
          introspection: exposeTooling,
          // Without this, a gRPC failure in a field resolver (lastRunAt) skips
          // GrpcErrorFilter and reaches the client unmasked.
          fieldResolverEnhancers: ["filters"],
          playground: false,
          plugins: [
            exposeTooling
              ? ApolloServerPluginLandingPageLocalDefault()
              : ApolloServerPluginLandingPageDisabled(),
          ],
          context: ({ req, res }: { req: Request; res: Response }) => ({
            req,
            res,
          }),
        };
      },
    }),
    AuthModule,
    UsersModule,
    WorkoutsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: toValidationGraphQLError,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: GrpcErrorFilter,
    },
  ],
})
export class AppModule {}
