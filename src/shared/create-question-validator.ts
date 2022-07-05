import { z } from 'zod';

export const createQuestionValidator = z.object({
  question: z.string().min(5).max(500),
  options: z
    .array(z.string().min(2).max(100))
    .min(2, { message: 'Options must have more atleast 2 entries' })
    .max(40, { message: 'Options must have less than 40 entries' }),
});

export type CreateQuestionInputType = z.infer<typeof createQuestionValidator>;
