import { createHash, randomBytes } from "node:crypto";
import { AppError } from "@/lib/server/AppError";
import {
  getRefreshTokenExpiryDate,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/server/jwt";
import { hashPassword, verifyPassword } from "@/lib/server/password";
import { getPrisma } from "@/lib/server/prisma";
import type { LoginInput, RegisterInput } from "@/validators/auth.schema";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function toPublicUser(user: {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}

async function issueTokens(userId: string, email: string) {
  const prisma = getPrisma();
  const accessToken = signAccessToken(userId, email);
  const refreshToken = signRefreshToken(userId);
  const tokenId = randomBytes(16).toString("hex");
  const storedToken = `${tokenId}.${hashToken(refreshToken)}`;

  await prisma.refreshToken.create({
    data: {
      token: storedToken,
      userId,
      expiresAt: getRefreshTokenExpiryDate(),
    },
  });

  return { accessToken, refreshToken };
}

export async function registerUser(input: RegisterInput) {
  const prisma = getPrisma();
  const existing = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existing) {
    throw new AppError("Email is already registered", 409, "EMAIL_EXISTS");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      name: input.name,
      streak: {
        create: {},
      },
    },
  });

  const tokens = await issueTokens(user.id, user.email);

  return {
    user: toPublicUser(user),
    ...tokens,
  };
}

export async function loginUser(input: LoginInput) {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const valid = await verifyPassword(input.password, user.passwordHash);

  if (!valid) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const tokens = await issueTokens(user.id, user.email);

  return {
    user: toPublicUser(user),
    ...tokens,
  };
}

export async function refreshSession(rawRefreshToken: string | undefined) {
  if (!rawRefreshToken) {
    throw new AppError("Refresh token required", 401, "UNAUTHORIZED");
  }

  let payload;

  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401, "UNAUTHORIZED");
  }

  const prisma = getPrisma();
  const hashed = hashToken(rawRefreshToken);
  const stored = await prisma.refreshToken.findFirst({
    where: {
      userId: payload.sub,
      token: {
        endsWith: hashed,
      },
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!stored) {
    throw new AppError("Invalid or expired refresh token", 401, "UNAUTHORIZED");
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });

  if (!user) {
    throw new AppError("User not found", 401, "UNAUTHORIZED");
  }

  const tokens = await issueTokens(user.id, user.email);

  return {
    user: toPublicUser(user),
    ...tokens,
  };
}

export async function logoutUser(rawRefreshToken: string | undefined) {
  if (!rawRefreshToken) {
    return;
  }

  const prisma = getPrisma();
  const hashed = hashToken(rawRefreshToken);

  await prisma.refreshToken.deleteMany({
    where: {
      token: {
        endsWith: hashed,
      },
    },
  });
}

export async function getCurrentUser(userId: string) {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return toPublicUser(user);
}
