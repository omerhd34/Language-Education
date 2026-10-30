import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().int().positive().default(3306),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

const mailEnvSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().min(1),
});

export type ServerEnv = z.infer<typeof envSchema>;
export type MailEnv = z.infer<typeof mailEnvSchema>;

let cached: ServerEnv | null = null;
let cachedMail: MailEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) {
    return cached;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  cached = parsed.data;
  return cached;
}

export function getMailEnv(): MailEnv {
  if (cachedMail) {
    return cachedMail;
  }

  const parsed = mailEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "Invalid mail environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error(
      "SMTP environment variables are required to send email (SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM)",
    );
  }

  cachedMail = parsed.data;
  return cachedMail;
}
