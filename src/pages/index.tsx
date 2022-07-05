import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  return (
    <Layout title='Polls'>
      <Polls />
    </Layout>
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
        {/* <PollForm /> */}
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

export default Home;
