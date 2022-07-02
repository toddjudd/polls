import { withTRPC } from '@trpc/next';
import { AppRouter } from '../backend/router';
import superjson from 'superjson';

import '../styles/globals.css';

import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

function getBaseUrl() {
  // console.group('getBaseUrl');
  // console.log({
  //   window: typeof window,
  //   vercel: process.env.VERCEL_URL,
  //   nextVercel: process.env.NEXT_PUBLIC_VERCEL_URL,
  //   localhost: `http://localhost:${process.env.PORT || 3000}`,
  // });
  // console.groupEnd();

  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_VERCEL_URL)
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    return {
      headers() {
        return {
          cookie: ctx?.req?.headers?.cookie,
        };
      },
      url: `${getBaseUrl()}/api/trpc`,
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
