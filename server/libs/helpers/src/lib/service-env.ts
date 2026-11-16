import { z } from "zod";

// Which deployment this process belongs to. Separate from NODE_ENV, which only
// says how the bundle was built: staging runs a production build.
export const appEnvSchema = z.enum(["development", "staging", "production"], {
  error: "must be development, staging or production",
});

export type AppEnv = z.infer<typeof appEnvSchema>;

const envSchema = z
  .object({
    APP_ENV: appEnvSchema,
    MONGODB_URI: z
      .string()
      .regex(/^mongodb(\+srv)?:\/\//, "must be a MongoDB connection string"),
    MONGODB_MAX_POOL_SIZE: z.coerce.number().int().min(1).default(10),
    // Locally, .env.serve sets GRPC_URL. Cloud Run sets only PORT and expects
    // the server on every interface, so GRPC_URL is derived from it there.
    GRPC_URL: z
      .string()
      .trim()
      .min(1, "must be a host:port to listen on")
      .optional(),
    PORT: z.coerce.number().int().min(1).max(65535).optional(),
  })
  .transform(({ GRPC_URL, PORT, ...env }, ctx) => {
    const url = GRPC_URL ?? (PORT ? `0.0.0.0:${PORT}` : undefined);
    if (!url) {
      ctx.addIssue({
        code: "custom",
        path: ["GRPC_URL"],
        message: "must be a host:port to listen on, or set PORT",
      });
      return z.NEVER;
    }
    return { ...env, GRPC_URL: url };
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
