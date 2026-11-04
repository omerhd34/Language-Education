import { z } from "zod";

export const vocabularyWordStatusSchema = z.enum(["KNOWN", "LEARNING"]);

export const setVocabularyWordStatusSchema = z.object({
  wordId: z.string().min(1).max(64),
  status: vocabularyWordStatusSchema.nullable(),
});

export const vocabularyStatusQuerySchema = z.object({
  categoryId: z.string().min(1).max(32).optional(),
});

export const vocabularyQuizTypeSchema = z.enum([
  "multiple_choice",
  "fill_blank",
  "listening",
]);

export const vocabularyQuizAnswerSchema = z.object({
  wordId: z.string().min(1).max(64),
  answer: z.string().min(1).max(200),
  quizType: vocabularyQuizTypeSchema,
});
