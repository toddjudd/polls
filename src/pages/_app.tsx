import { withTRPC } from '@trpc/next';
import { AppRouter } from '../backend/router';
import superjson from 'superjson';

import '../styles/globals.css';

import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return process.env.VERCEL_URL;
  if (process.env.NOW_URL) return process.env.NOW_URL;
  if (process.env.NEXT_PUBLIC_VERCEL_URL)
    return process.env.NEXT_PUBLIC_VERCEL_URL;
  if (process.env.NOW_REGION)
    return `https://${process.env.NOW_REGION}.vercel.app`;
  return '';
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    return {
      url: getBaseUrl() + '/api/trpc',
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(App);
