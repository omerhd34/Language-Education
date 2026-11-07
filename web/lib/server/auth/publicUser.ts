export type PublicAuthUser = {
  id: string;
  email: string;
  name: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  avatarUrl: string | null;
};

export function toPublicUser(user: {
  id: string;
  email: string;
  name: string | null;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  avatarMimeType: string | null;
}): PublicAuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    avatarUrl: user.avatarMimeType
      ? `/auth/me/avatar?v=${user.updatedAt.getTime()}`
      : null,
  };
}
