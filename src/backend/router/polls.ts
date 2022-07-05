import * as trpc from '@trpc/server';
import { prisma } from '../../db/client';
import { z } from 'zod';
import { createRouter } from './context';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { createQuestionValidator } from '../../shared/create-question-validator';

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
    input: createQuestionValidator,
    async resolve({ input, ctx }) {
      if (!ctx.ownerToken) throw new Error('Unauthorized');
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
