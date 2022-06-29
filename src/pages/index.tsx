import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Polls</title>
        <meta
          name='description'
          content='A polling app used to learn Next.js'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <h1 className='text-2xl font-bold'>Welcome to the polls app</h1>
        <Polls />
      </main>
    </div>
  );
};

const Polls: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['getPollQuestions']);
  if (isLoading || !data) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
};

export default Home;
