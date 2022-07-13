import { z } from 'zod';

export const pollFilterValidator = z.object({
  filter: z.enum(['Created', 'Participated', 'Public']).optional(),
});

export type PollFilterValidatorType = z.infer<typeof pollFilterValidator>;
