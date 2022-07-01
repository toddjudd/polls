import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  return (
    <div className='bg-zinc-700 text-white font-Pangolin h-screen '>
      <Head>
        <title>Polls</title>
        <meta
          name='description'
          content='A polling app used to learn Next.js'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='p-4 flex flex-col min-h-full'>
        <h1 className='text-4xl font-bold '>Polls</h1>
        <h2 className='text-2xl '>What do you want to ask?</h2>
        <div className='m-8 border-4 border-zinc-200 rounded-lg box-border p-4 flex-1'>
          <Polls />
          <PollForm />
        </div>
      </main>
    </div>
  );
};

const Polls: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['polls.get-all']);
  console.log(data);
  if (isLoading || !data) return <div>Loading...</div>;
  if (!isLoading && data.length === 0) return <div>No polls yet</div>;
  return (
    <div>
      {data.map(({ question, id }, i) => (
        <Link key={i} href={`/poll/${id}`}>
          <div key={i}>{question}</div>
        </Link>
      ))}
    </div>
  );
};

const PollForm: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation(['polls.create'], {
    onSuccess: () => {
      client.invalidateQueries(['polls.get-all']);
      setQuestion('');
    },
  });
  const [question, setQuestion] = useState('');

  return (
    <input
      type='text'
      ref={inputRef}
      disabled={isLoading}
      className='border-b-zinc-50 border-b-2 bg-transparent focus:outline-0 focus:border-zinc-200'
      value={question}
      onChange={(e) => {
        setQuestion(e.currentTarget.value);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          mutate({ question });
        }
      }}
    />
  );
};

export default Home;
