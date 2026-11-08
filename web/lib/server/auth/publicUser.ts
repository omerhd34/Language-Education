export const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  emailVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
  avatarMimeType: true,
} as const;

export type PublicAuthUser = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  avatarUrl: string | null;
};

export function toPublicUser(user: {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  avatarMimeType: string | null;
}): PublicAuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    avatarUrl: user.avatarMimeType
      ? `/auth/me/avatar?v=${user.updatedAt.getTime()}`
      : null,
  };
}
