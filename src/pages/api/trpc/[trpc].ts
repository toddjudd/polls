import * as trpcNext from '@trpc/server/adapters/next';

import { appRouter } from '../../../server/router';
import { createContext } from '../../../server/router/context';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
