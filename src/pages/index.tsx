import type { NextPage } from 'next';
import Head from 'next/head';

import { prisma } from '../db/client';

export const getServerSideProps = async () => {
  const questions = await prisma.pollQuestion.findMany();
  return {
    props: {
      questions: JSON.stringify(questions, null, 2),
    },
  };
};

const Home: NextPage = (props: any) => {
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
        <code>{props.questions}</code>
      </main>
    </div>
  );
};

export default Home;
