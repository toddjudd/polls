import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react';
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
      <main className='bg-zinc-600 m-8 rounded-lg flex flex-col'>
        <Link href='/poll/create'>
          <div className='flex justify-between p-4 border-b-[1px] border-zinc-400'>
            <div className='text-xl font-bold'>Polls</div>
            <div className='bg-zinc-300 text-sm text-zinc-600  p-2 rounded-md'>
              Create Question
            </div>
          </div>
        </Link>
        <Polls />
        {/* <PollForm /> */}
      </main>
    </div>
  );
};

const Polls: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['polls.get-all-by-user']);
  if (isLoading || !data) {
    return <div className='p-4 py-10'>Loading...</div>;
  }
  if (!isLoading && data.length === 0) {
    return (
      <div className='p-4 py-10 flex flex-col gap-4 align-middle justify-around'>
        <div>No polls yet</div>
        <PollForm />
      </div>
    );
  }
  return (
    <div className='flex flex-col'>
      {data.map(({ question, id }, i, arr) => (
        <Link key={i} href={`/poll/${id}`}>
          <div
            className={`p-4 py-10 ${
              i + 1 !== arr.length ? 'border-b-[1px] border-zinc-400' : ''
            }`}
            key={i}>
            {question}
          </div>
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
      client.invalidateQueries(['polls.get-all-by-user']);
      setQuestion('');
      inputRef?.current?.focus();
    },
  });
  const [question, setQuestion] = useState('');

  return (
    <input
      type='text'
      ref={inputRef}
      disabled={isLoading}
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
