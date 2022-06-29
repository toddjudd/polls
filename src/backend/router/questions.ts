import * as trpc from '@trpc/server';

import { prisma } from '../../db/client';
import { z } from 'zod';

export const pollRouter = trpc
  .router()
  .query('getAll', {
    async resolve() {
      return await prisma.pollQuestion.findMany();
    },
  })
  .mutation('create', {
    input: z.object({
      question: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
        },
      });
    },
  });

// export type definition of API
export type PollRouter = typeof pollRouter;
