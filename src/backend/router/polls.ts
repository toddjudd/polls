import * as trpc from '@trpc/server';
import { prisma } from '../../db/client';
import { z } from 'zod';
import { createRouter } from './context';
import { createNextApiHandler } from '@trpc/server/adapters/next';

export const pollRouter = createRouter()
  .query('get-all', {
    async resolve() {
      return await prisma.pollQuestion.findMany();
    },
  })
  .query('get-all-by-user', {
    async resolve({ ctx: { ownerToken } }) {
      if (!ownerToken) return [];
      return await prisma.pollQuestion.findMany({
        where: { ownerToken },
      });
    },
  })
  .query('get-by-id', {
    input: z.object({ id: z.string() }),
    async resolve({ input: { id }, ctx }) {
      const poll = await prisma.pollQuestion.findFirst({
        where: { id },
      });
      return { ...poll, isOwner: poll?.ownerToken === ctx.ownerToken };
    },
  })
  .mutation('create', {
    input: z.object({
      question: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.ownerToken) return { error: 'Unauthorized', status: 401 };
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: [],
          ownerToken: ctx.ownerToken,
        },
      });
    },
  });

// export type definition of API
export type PollRouter = typeof pollRouter;
