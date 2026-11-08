import { createHash, randomBytes } from "node:crypto";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { AppError } from "@/lib/server/AppError";
import {
  getRefreshTokenExpiryDate,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/server/jwt";
import { buildVerificationEmail, sendMail } from "@/lib/server/mail";
import { getServerEnv } from "@/lib/server/env";
import { hashPassword, verifyPassword } from "@/lib/server/password";
import { getPrisma } from "@/lib/server/prisma";
import { publicUserSelect, toPublicUser } from "@/lib/server/auth/publicUser";
import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  VerifyEmailInput,
} from "@/validators/auth.schema";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
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

async function createAndSendVerificationEmail(user: {
  id: string;
  email: string;
  name: string | null;
}) {
  const prisma = getPrisma();
  const env = getServerEnv();
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);

  await prisma.emailVerificationToken.deleteMany({
    where: { userId: user.id },
  });

  await prisma.emailVerificationToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
    },
  });

  const verifyPath = getPathname({
    href: "/verify-email",
    locale: routing.defaultLocale,
  });
  const verifyUrl = `${env.APP_URL}${verifyPath}?token=${rawToken}`;
  const email = buildVerificationEmail({
    name: user.name,
    verifyUrl,
  });

  await sendMail({
    to: user.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
}

export async function registerUser(input: RegisterInput) {
  const prisma = getPrisma();
  const email = input.email.toLowerCase();
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing?.emailVerifiedAt) {
    throw new AppError("Email is already registered", 409, "EMAIL_EXISTS");
  }

  const passwordHash = await hashPassword(input.password);

  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          name: input.name ?? existing.name,
        },
      })
    : await prisma.user.create({
        data: {
          email,
          passwordHash,
          name: input.name,
          streak: {
            create: {},
          },
        },
      });

  try {
    await createAndSendVerificationEmail(user);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new AppError(
      "Failed to send verification email",
      502,
      "EMAIL_SEND_FAILED",
    );
  }

  return {
    email: user.email,
  };
}

export async function verifyEmail(input: VerifyEmailInput) {
  const prisma = getPrisma();
  const tokenHash = hashToken(input.token);
  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record || record.expiresAt.getTime() <= Date.now()) {
    if (record) {
      await prisma.emailVerificationToken.delete({ where: { id: record.id } });
    }
    throw new AppError(
      "Invalid or expired verification token",
      400,
      "INVALID_VERIFICATION_TOKEN",
    );
  }

  const user = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: record.userId },
      data: {
        emailVerifiedAt: new Date(),
      },
      select: publicUserSelect,
    });

    await tx.emailVerificationToken.deleteMany({
      where: { userId: record.userId },
    });

    return updated;
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
    select: {
      ...publicUserSelect,
      passwordHash: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const valid = await verifyPassword(input.password, user.passwordHash);

  if (!valid) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  if (!user.emailVerifiedAt) {
    throw new AppError("Email is not verified", 403, "EMAIL_NOT_VERIFIED");
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

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: publicUserSelect,
  });

  if (!user || !user.emailVerifiedAt) {
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

  try {
    await prisma.refreshToken.deleteMany({
      where: {
        token: {
          endsWith: hashed,
        },
      },
    });
  } catch (error) {
    console.error("Failed to revoke refresh token during logout:", error);
  }
}

export async function getCurrentUser(userId: string) {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });

  if (!user || !user.emailVerifiedAt) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return toPublicUser(user);
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const prisma = getPrisma();
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, emailVerifiedAt: true },
  });

  if (!existing || !existing.emailVerifiedAt) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const name = `${input.firstName} ${input.lastName}`.trim();
  const phone = input.phone?.trim() ? input.phone.trim() : null;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, phone },
    select: publicUserSelect,
  });

  return toPublicUser(user);
}

export async function changePassword(
  userId: string,
  input: ChangePasswordInput,
) {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.emailVerifiedAt) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const valid = await verifyPassword(input.currentPassword, user.passwordHash);

  if (!valid) {
    throw new AppError(
      "Current password is incorrect",
      400,
      "INVALID_CURRENT_PASSWORD",
    );
  }

  const passwordHash = await hashPassword(input.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { message: "Password updated" };
}
