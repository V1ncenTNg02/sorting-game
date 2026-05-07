import { z } from 'zod';

const GameItemSchema = z.object({
  id: z.string(),
  shape: z.enum(['triangle', 'square', 'circle']),
  colour: z.enum(['red', 'green', 'blue']),
  position: z.object({ x: z.number(), y: z.number() }).optional(),
  bucketId: z.string().optional(),
});

export const PostGameSchema = z.object({
  items: z.array(GameItemSchema).min(1, 'items must contain at least one item'),
  duration_ms: z.number().int().nonnegative().optional(),
  completed: z.boolean().optional(),
});

export const PatchGameSchema = PostGameSchema.partial();

export type PostGameBody = z.infer<typeof PostGameSchema>;
export type PatchGameBody = z.infer<typeof PatchGameSchema>;
