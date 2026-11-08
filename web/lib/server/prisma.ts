import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import mariadb, { type Pool } from "mariadb";
import { getServerEnv } from "@/lib/server/env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  mariadbPool?: Pool;
  prismaResetting?: Promise<void>;
};

function resolveDatabaseHost(host: string): string {
  if (host === "localhost" || host === "::1") {
    return "127.0.0.1";
  }

  return host;
}

function createPool(): Pool {
  const env = getServerEnv();

  return mariadb.createPool({
    host: resolveDatabaseHost(env.DATABASE_HOST),
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    connectionLimit: 10,
    connectTimeout: 5_000,
    acquireTimeout: 8_000,
    idleTimeout: 30_000,
    resetAfterUse: true,
  });
}

function createPrismaClient(pool: Pool): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaMariaDb(pool, {
      disposeExternalPool: false,
    }),
  });
}

function ensurePrismaClient(): PrismaClient {
  if (!globalForPrisma.mariadbPool) {
    globalForPrisma.mariadbPool = createPool();
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient(globalForPrisma.mariadbPool);
  }

  return globalForPrisma.prisma;
}

export function getPrisma(): PrismaClient {
  return ensurePrismaClient();
}

function formatErrorCause(error: unknown): string {
  const parts: string[] = [];
  let current: unknown = error;

  for (let depth = 0; depth < 5 && current; depth += 1) {
    if (current instanceof Error) {
      parts.push(current.message);
      current = current.cause;
      continue;
    }

    if (
      typeof current === "object" &&
      current !== null &&
      "message" in current
    ) {
      parts.push(String((current as { message: unknown }).message));
    }

    break;
  }

  return parts.filter(Boolean).join(" | ");
}

export function isPrismaPoolError(error: unknown): boolean {
  const text = formatErrorCause(error).toLowerCase();

  if (!text) {
    return false;
  }

  return (
    text.includes("pool failed to retrieve a connection") ||
    text.includes("pool timeout") ||
    text.includes("closed the pool") ||
    text.includes("pool is closed") ||
    text.includes("p2039")
  );
}

export async function resetPrisma(): Promise<void> {
  if (globalForPrisma.prismaResetting) {
    await globalForPrisma.prismaResetting;
    return;
  }

  globalForPrisma.prismaResetting = (async () => {
    const client = globalForPrisma.prisma;
    const pool = globalForPrisma.mariadbPool;
    globalForPrisma.prisma = undefined;
    globalForPrisma.mariadbPool = undefined;

    try {
      await client?.$disconnect();
    } catch {}

    try {
      await pool?.end();
    } catch {}
  })();

  try {
    await globalForPrisma.prismaResetting;
  } finally {
    globalForPrisma.prismaResetting = undefined;
  }
}

export async function withPrisma<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isPrismaPoolError(error)) {
      throw error;
    }

    console.error(
      "MariaDB pool error, recreating Prisma client:",
      formatErrorCause(error),
    );
    await resetPrisma();
    return operation();
  }
}
