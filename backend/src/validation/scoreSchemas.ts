import { z } from 'zod';

export const PostScoreSchema = z.object({
  value: z.number().int().positive(),
});

export type PostScoreBody = z.infer<typeof PostScoreSchema>;
