import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { type NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app/app.module";
import { Env } from "./app/env";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Cloud Run's front end is one proxy hop. Trusting it makes req.ip the
  // caller's address (the last X-Forwarded-For entry) instead of the proxy's;
  // otherwise the sign-in rate limit is one bucket shared by everyone.
  app.set("trust proxy", 1);
  // Cloud Run sends SIGTERM before stopping an instance. Node as PID 1 ignores
  // it without a handler, so in-flight requests would die at SIGKILL instead.
  app.enableShutdownHooks();
  const config = app.get<ConfigService<Env, true>>(ConfigService);
  // The client sends its JWT in the Authorization header, not a cookie, so
  // credentialed CORS isn't needed.
  app.enableCors({ origin: config.get("CORS_ORIGINS", { infer: true }) });
  const port = config.get("PORT", { infer: true });
  await app.listen(port);
  // Set when Nx waits for this server to be ready
  if (process.env.NX_READY_SIGNAL_SOCKET) {
    try {
      // Function keeps TypeScript and bundlers from rewriting or bundling the import
      const load = new Function("s", "return import(s)") as (
        s: string,
      ) => Promise<{ emitReadySignal(server: unknown): boolean }>;
      (await load("@nx/js/ready-signal")).emitReadySignal(app.getHttpServer());
    } catch {
      // @nx/js isn't installed
    }
  }
  Logger.log(`🚀 Application is running on: http://localhost:${port}/graphql`);
}

bootstrap();
