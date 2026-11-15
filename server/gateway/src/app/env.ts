import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().default(3000),
  JWT_SECRET: z.string().min(32, "must be at least 32 characters"),
  USERS_GRPC_URL: z.string().default("localhost:50052"),
  WORKOUTS_GRPC_URL: z.string().default("localhost:50051"),
  INTERNAL_SECRET: z.string().min(32, "must be at least 32 characters"),
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
