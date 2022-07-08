import { z } from 'zod';

export const createVoteValidator = z.object({
  pollId: z.string().max(256),
  choice: z.number(),
});

export type CreateVoteInputType = z.infer<typeof createVoteValidator>;
