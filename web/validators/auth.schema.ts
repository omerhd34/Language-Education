import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(1).max(100).optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(128),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export const updateAvatarSchema = z.object({
  dataUrl: z
    .string()
    .min(32)
    .max(600_000)
    .regex(/^data:image\/(jpeg|png|webp);base64,/),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
