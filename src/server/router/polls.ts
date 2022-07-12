import { z } from 'zod';

import { createPollValidator } from '../../shared/create-poll-validator';
import { createVoteValidator } from '../../shared/create-vote-validator';
import { pollFilterValidator } from '../../shared/poll-filter-validator';
import { prisma } from '../db/client';

import { createRouter } from './context';

export const pollRouter = createRouter()
  .query('get-all', {
    input: pollFilterValidator,
    async resolve({ input: { filter }, ctx: { ownerToken } }) {
      if (!ownerToken) throw new Error('Unauthorized');
      //build prisma where statement
      let where = {};
      switch (filter) {
        case 'Created':
          where = { ownerToken };
          break;
        case 'Participated':
          where = { Vote: { some: { voterToken: ownerToken } } };
          break;
        default:
          where = {};
          break;
      }
      return await prisma.pollQuestion.findMany({ where });
    },
  })
  .query('get-all-mine', {
    async resolve({ ctx: { ownerToken } }) {
      if (!ownerToken) throw new Error('Unauthorized');
      return await prisma.pollQuestion.findMany({
        where: { ownerToken },
      });
    },
  })
  .query('get-all-particapated', {
    async resolve({ ctx: { ownerToken } }) {
      if (!ownerToken) throw new Error('Unauthorized');
      return await prisma.pollQuestion.findMany({
        where: { Vote: { some: { voterToken: ownerToken } } },
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
        where: { pollId: id, voterToken: ctx.ownerToken },
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
        isOwner: poll?.ownerToken === ctx.ownerToken,
        hasVoted: myVotes.length > 0,
        myVotes,
        voteResults,
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
  })
  .mutation('delete-by-id', {
    input: z.object({ id: z.string() }),
    async resolve({ input: { id }, ctx }) {
      if (!ctx.ownerToken) throw new Error('Unauthorized');
      return await prisma.pollQuestion.delete({
        where: { id },
      });
    },
  });

// export type definition of API
export type PollRouter = typeof pollRouter;
