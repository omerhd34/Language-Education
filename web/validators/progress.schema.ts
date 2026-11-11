import { z } from "zod";

export const progressResetScopeSchema = z.enum([
  "grammar",
  "vocabulary",
  "reading",
  "listening",
  "writing",
  "speaking",
  "all",
]);

export const progressResetSchema = z.object({
  scope: progressResetScopeSchema,
});

export type ProgressResetScope = z.infer<typeof progressResetScopeSchema>;
