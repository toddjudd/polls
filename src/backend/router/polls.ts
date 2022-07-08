import * as trpc from '@trpc/server';
import { prisma } from '../../db/client';
import { z } from 'zod';
import { createRouter } from './context';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { createPollValidator } from '../../shared/create-poll-validator';
import { createVoteValidator } from '../../shared/create-vote-validator';

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
      const myVotes = await prisma.vote.findMany({
        where: { pollId: id, voterToken: ctx.ownerToken },
      });
      let votes = await prisma.vote.groupBy({
        where: { pollId: id },
        by: ['choice'],
        _count: true,
      });
      return {
        ...poll,
        isOwner: poll?.ownerToken === ctx.ownerToken,
        hasVoted: myVotes.length > 0,
        myVotes,
        votes,
      };
    },
  })
  .mutation('create', {
    input: createPollValidator,
    async resolve({ input, ctx }) {
      if (!ctx.ownerToken) throw new Error('Unauthorized');
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: input.options,
          ownerToken: ctx.ownerToken,
        },
      });
    },
  })
  .mutation('vote', {
    input: createVoteValidator,
    async resolve({ input, ctx }) {
      if (!ctx.ownerToken) throw new Error('Unauthorized');
      return await prisma.vote.create({
        data: {
          pollId: input.pollId,
          choice: input.choice,
          voterToken: ctx.ownerToken,
        },
      });
    },
  });

// export type definition of API
export type PollRouter = typeof pollRouter;
