import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';

import { authOptions as nextAuthOptions } from '../../pages/api/auth/[...nextauth]';
import { prisma } from '../db/client';

// The app's context - is generated for each incoming request
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers
  const req = opts.req;
  const res = opts.res;

  // not needed now that opts is not optional
  // if (!req || !res) throw new Error('tRPC Context Missing req or res');

  const ownerToken = opts?.req.cookies['poll-user-token'];
  const user = await getToken({ req });

  return {
    ownerToken,
    req,
    res,
    user,
    prisma,
  };
}

type Context = trpc.inferAsyncReturnType<typeof createContext>;

// Helper function to create a router with your app's context
export const createRouter = () => trpc.router<Context>();
