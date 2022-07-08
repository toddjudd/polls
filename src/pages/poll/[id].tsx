import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../components/layout';
import { trpc } from '../../utils/trpc';

const Options: React.FC<{ options: string[] }> = ({ options }) => {
  return (
    <>
      {options.map((option, i) => (
        <div key={i} className='bg-zinc-300 text-zinc-800 p-2 rounded-md'>
          {option}
        </div>
      ))}
    </>
  );
};

const PollPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading } = trpc.useQuery(['polls.get-by-id', { id }]);
  if (isLoading) return <div>Loading...</div>;
  if (!isLoading && !data) return <div>Question not found</div>;
  return (
    <div className='p-4 grid gap-2 max-w-2xl m-[auto]'>
      {/* {data?.isOwner && <div>You are the owner of this poll</div>} */}
      <div className='justify-self-center text-4xl'>{data?.question}</div>
      <Options options={data?.options as string[]} />
    </div>
  );
};

const PollPage: NextPage = () => {
  const {
    query: { id, options },
  } = useRouter();
  if (!id || typeof id !== 'string') return <div>No ID</div>;

  return (
    <Layout title='Poll'>
      <PollPageContent id={id} />
    </Layout>
  );
};

export default PollPage;
