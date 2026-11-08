import { AppError } from "@/lib/server/AppError";
import { publicUserSelect, toPublicUser } from "@/lib/server/auth/publicUser";
import { getPrisma } from "@/lib/server/prisma";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const MAX_AVATAR_BYTES = 400_000;

const DATA_URL_PATTERN =
  /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/;

function parseAvatarDataUrl(dataUrl: string): {
  mimeType: string;
  buffer: Buffer;
} {
  const match = DATA_URL_PATTERN.exec(dataUrl.trim());

  if (!match) {
    throw new AppError(
      "Invalid avatar image. Use JPEG, PNG, or WebP.",
      400,
      "INVALID_AVATAR",
    );
  }

  const mimeType = match[1];
  const buffer = Buffer.from(match[2], "base64");

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new AppError(
      "Invalid avatar image. Use JPEG, PNG, or WebP.",
      400,
      "INVALID_AVATAR",
    );
  }

  if (buffer.byteLength === 0 || buffer.byteLength > MAX_AVATAR_BYTES) {
    throw new AppError(
      "Avatar must be between 1 byte and 400 KB.",
      400,
      "AVATAR_TOO_LARGE",
    );
  }

  return { mimeType, buffer };
}

export async function getUserAvatarBinary(userId: string) {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      emailVerifiedAt: true,
      avatarData: true,
      avatarMimeType: true,
      updatedAt: true,
    },
  });

  if (!user || !user.emailVerifiedAt) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  if (!user.avatarData || !user.avatarMimeType) {
    throw new AppError("Avatar not found", 404, "NOT_FOUND");
  }

  return {
    data: Buffer.from(user.avatarData),
    mimeType: user.avatarMimeType,
    updatedAt: user.updatedAt,
  };
}

export async function updateUserAvatar(userId: string, dataUrl: string) {
  const { mimeType, buffer } = parseAvatarDataUrl(dataUrl);
  const prisma = getPrisma();

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, emailVerifiedAt: true },
  });

  if (!existing || !existing.emailVerifiedAt) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      avatarData: new Uint8Array(buffer),
      avatarMimeType: mimeType,
    },
    select: publicUserSelect,
  });

  return toPublicUser(user);
}

export async function deleteUserAvatar(userId: string) {
  const prisma = getPrisma();

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, emailVerifiedAt: true },
  });

  if (!existing || !existing.emailVerifiedAt) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      avatarData: null,
      avatarMimeType: null,
    },
    select: publicUserSelect,
  });

  return toPublicUser(user);
}
