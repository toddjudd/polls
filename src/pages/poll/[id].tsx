import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../components/layout';
import { trpc } from '../../utils/trpc';

const PollPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading } = trpc.useQuery(['polls.get-by-id', { id }]);
  if (isLoading) return <div>Loading...</div>;
  if (!isLoading && !data) return <div>Question not found</div>;
  return (
    <div className='p-4'>
      {data?.isOwner && <div>You are the owner of this poll</div>}
      <h1>{data?.question}</h1>
      <Options options={data?.options as string[]} />
    </div>
  );
};

const Options: React.FC<{ options: string[] }> = ({ options }) => {
  return (
    <div>
      {options.map((option, i) => (
        <div key={i}>{option}</div>
      ))}
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
