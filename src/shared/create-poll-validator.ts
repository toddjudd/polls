import { z } from 'zod';

export const createPollValidator = z.object({
  question: z.string().min(5).max(500),
  options: z
    .array(
      z.object({
        text: z.string().min(2).max(100),
      })
    )
    .min(2, { message: 'Options must have more atleast 2 entries' })
    .max(40, { message: 'Options must have less than 40 entries' }),
});

export type CreatePollInputType = z.infer<typeof createPollValidator>;
