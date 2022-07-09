import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../components/layout';
import { trpc } from '../../utils/trpc';

const Poll: NextPage = () => {
  const {
    query: { id, options },
  } = useRouter();
  if (!id || typeof id !== 'string') return <div>No ID</div>;
  const client = trpc.useContext();
  const { data, isLoading } = trpc.useQuery(['polls.get-by-id', { id }]);
  const { mutate } = trpc.useMutation('polls.vote', {
    onSuccess: () => {
      client.invalidateQueries(['polls.get-by-id']);
    },
  });
  if (isLoading)
    return <div className='p-4 flex justify-center'>Loading...</div>;
  if (!isLoading && !data?.id)
    return <div className='p-4 flex justify-center'>Question not found</div>;
  return (
    <div className='p-4 grid gap-2 max-w-2xl m-[auto]'>
      <div className='justify-self-center text-4xl'>{data?.question}</div>
      {(data?.options as { text: string }[])?.map((option, i) => (
        <div
          key={i}
          className={`flex justify-between bg-zinc-300 text-zinc-800 p-2 rounded-md ${
            data?.myVotes?.findIndex((vote) => vote.choice === i) >= 0
              ? 'border-zinc-800 border-4'
              : ''
          }`}
          onClick={() => {
            if (data?.hasVoted) return;
            mutate({ pollId: id, choice: i });
          }}>
          <span>{option.text}</span>
          <span>
            Votes:{' '}
            {data?.votes?.[data?.votes?.findIndex((vote) => vote.choice === i)]
              ?._count || 0}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Poll;
