import { z } from "zod";

export const progressResetScopeSchema = z.enum(["vocabulary", "topics", "all"]);

export const progressResetSchema = z.object({
  scope: progressResetScopeSchema,
});

export type ProgressResetScope = z.infer<typeof progressResetScopeSchema>;
