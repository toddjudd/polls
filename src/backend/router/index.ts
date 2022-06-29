import * as trpc from '@trpc/server';

import superjson from 'superjson';
import { pollRouter } from './questions';

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .merge('polls.', pollRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
