import { appEnvSchema } from "@workout-tracker/helpers";
import { z } from "zod";

const grpcUrl = z.string().trim().min(1, "must be a host:port to call");

// Comma-separated origins allowed to call the API from a browser, such as
// "https://app.example.com,http://localhost:8100".
const corsOrigins = z
  .string()
  .transform((value) =>
    value
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  )
  .pipe(
    z
      .array(
        z
          .url({ protocol: /^https?$/, error: "must be http(s) URLs" })
          .refine((url) => new URL(url).origin === url, {
            error: "must be bare origins, with no path or trailing slash",
          }),
      )
      .min(1, "must list at least one origin"),
  );

const envSchema = z.object({
  APP_ENV: appEnvSchema,
  PORT: z.coerce.number().int().default(3000),
  JWT_SECRET: z.string().min(32, "must be at least 32 characters"),
  // No defaults: a missing URL must fail at boot, not quietly dial localhost.
  USERS_GRPC_URL: grpcUrl,
  WORKOUTS_GRPC_URL: grpcUrl,
  // See grpc-credentials.ts. Cloud Run rejects plaintext, so forgetting to
  // set it there fails loudly on the first call.
  GRPC_AUTH: z.enum(["none", "google-id-token"]).default("none"),
  CORS_ORIGINS: corsOrigins,
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => ` ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment:\n${problems}`);
  }
  return result.data;
}
