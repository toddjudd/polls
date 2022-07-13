import { createNextApiHandler } from '@trpc/server/adapters/next';
import { z } from 'zod';

import { createPollValidator } from '../../shared/create-poll-validator';
import { createVoteValidator } from '../../shared/create-vote-validator';
import { pollFilterValidator } from '../../shared/poll-filter-validator';
import { prisma } from '../db/client';

import { createRouter } from './context';

export const pollRouter = createRouter()
  .middleware(({ ctx, next }) => {
    if (!ctx.ownerToken && !ctx.user) throw new Error('Unauthorized');
    return next({ ctx: { ...ctx, user: { ...ctx.user, id: ctx.user?.sub } } });
  })
  .query('get-all', {
    input: pollFilterValidator,
    async resolve({ input: { filter }, ctx: { ownerToken, user } }) {
      //build prisma where statement
      let where = {};
      switch (filter) {
        case 'Created':
          where = { ownerToken, userId: user.id };
          break;
        case 'Participated':
          where = {
            Vote: { some: { voterToken: ownerToken, userId: user.id } },
          };
          break;
        case 'Public':
          where = {};
          break;
        default:
          where = {};
          break;
      }
      const polls = await prisma.pollQuestion.findMany({ where });
      return polls.map((poll) => ({
        ...poll,
        isOwner: poll.ownerToken === ownerToken || poll.userId === user.id,
      }));
    },
  })
  .query('get-all-mine', {
    async resolve({ ctx: { ownerToken, user } }) {
      return await prisma.pollQuestion.findMany({
        where: { ownerToken, userId: user.id },
      });
    },
  })
  .query('get-all-particapated', {
    async resolve({ ctx: { ownerToken, user } }) {
      return await prisma.pollQuestion.findMany({
        where: { Vote: { some: { voterToken: ownerToken, userId: user.id } } },
      });
    },
  })
  .query('get-by-id', {
    input: z.object({ id: z.string() }),
    async resolve({ input: { id }, ctx }) {
      const poll = await prisma.pollQuestion.findFirst({
        where: { id },
        include: { Vote: true },
      });
      const myVotes = await prisma.vote.findMany({
        where: { pollId: id, voterToken: ctx.ownerToken, userId: ctx.user.id },
      });
      const voteCount = await prisma.vote.groupBy({
        where: { pollId: id },
        by: ['choice'],
        _count: true,
      });
      const voteResults = (poll?.options as { text: string }[])?.map(
        (option, index) => {
          const count = voteCount?.find(
            (vote) => vote.choice === index
          )?._count;
          const percentage =
            count && poll?.Vote?.length
              ? (count / poll?.Vote?.length) * 100
              : 0;
          return { count, percentage, text: option.text };
        }
      );
      return {
        ...poll,
        isOwner:
          poll?.ownerToken === ctx.ownerToken || poll?.userId === ctx.user?.id,
        hasVoted: myVotes.length > 0,
        myVotes,
        voteResults,
      };
    },
  })
  .mutation('create', {
    input: createPollValidator,
    async resolve({ input, ctx }) {
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: input.options,
          ownerToken: ctx.ownerToken,
          userId: ctx.user.id,
        },
      });
    },
  })
  .mutation('vote', {
    input: createVoteValidator,
    async resolve({ input, ctx }) {
      return await prisma.vote.create({
        data: {
          pollId: input.pollId,
          choice: input.choice,
          voterToken: ctx.ownerToken,
          userId: ctx.user.id,
        },
      });
    },
  })
  .mutation('delete-by-id', {
    input: z.object({ id: z.string() }),
    async resolve({ input: { id }, ctx }) {
      return await prisma.pollQuestion.deleteMany({
        where: { id, ownerToken: ctx.ownerToken, userId: ctx.user.id },
      });
    },
  });

// export type definition of API
export type PollRouter = typeof pollRouter;
