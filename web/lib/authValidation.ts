import { z } from "zod";

export function createLoginSchema(messages: {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
}) {
  return z.object({
    email: z
      .string()
      .min(1, messages.emailRequired)
      .pipe(z.email(messages.emailInvalid)),
    password: z.string().min(1, messages.passwordRequired),
  });
}

export function createRegisterSchema(messages: {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMin: string;
}) {
  return z.object({
    name: z.string().trim().max(100).optional().or(z.literal("")),
    email: z
      .string()
      .min(1, messages.emailRequired)
      .pipe(z.email(messages.emailInvalid)),
    password: z
      .string()
      .min(1, messages.passwordRequired)
      .min(8, messages.passwordMin),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
