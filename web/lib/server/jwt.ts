import jwt from "jsonwebtoken";
import { getServerEnv } from "@/lib/server/env";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  type: "refresh";
};

export function signAccessToken(userId: string, email: string): string {
  const env = getServerEnv();
  const payload: AccessTokenPayload = {
    sub: userId,
    email,
    type: "access",
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(userId: string): string {
  const env = getServerEnv();
  const payload: RefreshTokenPayload = {
    sub: userId,
    type: "refresh",
  };

  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const env = getServerEnv();
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

  if (typeof decoded === "string" || decoded.type !== "access") {
    throw new Error("Invalid access token");
  }

  return decoded as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const env = getServerEnv();
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);

  if (typeof decoded === "string" || decoded.type !== "refresh") {
    throw new Error("Invalid refresh token");
  }

  return decoded as RefreshTokenPayload;
}

export function getRefreshTokenExpiryDate(): Date {
  const env = getServerEnv();
  const match = /^(\d+)([smhd])$/i.exec(env.JWT_REFRESH_EXPIRES_IN.trim());
  const expiresAt = new Date();

  if (!match) {
    expiresAt.setDate(expiresAt.getDate() + 7);
    return expiresAt;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "s":
      expiresAt.setSeconds(expiresAt.getSeconds() + amount);
      break;
    case "m":
      expiresAt.setMinutes(expiresAt.getMinutes() + amount);
      break;
    case "h":
      expiresAt.setHours(expiresAt.getHours() + amount);
      break;
    case "d":
      expiresAt.setDate(expiresAt.getDate() + amount);
      break;
    default:
      expiresAt.setDate(expiresAt.getDate() + 7);
  }

  return expiresAt;
}
