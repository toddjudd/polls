import { createReactQueryHooks } from '@trpc/react';

import type { AppRouter } from '../server/router';

export const trpc = createReactQueryHooks<AppRouter>();

/**
 * Check out tRPC docs for Inference Helpers
 * https://trpc.io/docs/infer-types#inference-helpers
 */
