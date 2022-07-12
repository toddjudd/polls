import superjson from 'superjson';

import { authRouter } from './auth';
import { createRouter } from './context';
import { pollRouter } from './polls';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('polls.', pollRouter)
  .merge('auth.', authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
