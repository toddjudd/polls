import { XIcon, ExclamationIcon } from '@heroicons/react/solid';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import PollContextMenu from '../../components/Poll/PollContextMenu';
import { trpc } from '../../utils/trpc';

const Poll: NextPage = () => {
  const backgrounds = useRef(
    [
      'bg-amber-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-blue-500',
      'bg-red-500',
      'bg-green-500',
    ].sort(() => Math.random() - 0.5)
  );
  const {
    query: { id: rawId },
  } = useRouter();

  let id = '';
  if (rawId && typeof rawId === 'string') {
    id = rawId;
  }

  const client = trpc.useContext();
  const { data, isLoading } = trpc.useQuery(['polls.get-by-id', { id }]);
  const session = useSession();
  const [showWarning, setShowWarning] = useState(true);
  console.log({ session, data });
  const { mutate, isLoading: isMutating } = trpc.useMutation('polls.vote', {
    onSuccess: () => {
      client.invalidateQueries(['polls.get-by-id']);
    },
  });

  if (!rawId || typeof rawId !== 'string')
    return (
      <div className='max-w-4xl flex-1 bg-zinc-600 m-8 rounded-lg '>
        <div className='flex flex-col'>
          <div className='p-4 border-b border-zinc-300 last-of-type:border-0 flex justify-between'>
            <div className='text-xl font-bold'>Question not found</div>
          </div>
        </div>
      </div>
    );

  if (isLoading)
    return (
      <div className='max-w-4xl flex-1 bg-zinc-600 m-8 rounded-lg '>
        <div className='flex flex-col'>
          <div className='p-4 border-b border-zinc-300 last-of-type:border-0 flex justify-between'>
            <div className='text-xl font-bold'>Loading</div>
          </div>
        </div>
      </div>
    );
  if (!isLoading && !data?.id)
    return (
      <div className='max-w-4xl flex-1 bg-zinc-600 m-8 rounded-lg '>
        <div className='flex flex-col'>
          <div className='p-4 border-b border-zinc-300 last-of-type:border-0 flex justify-between'>
            <div className='text-xl font-bold'>Question not found</div>
          </div>
        </div>
      </div>
    );
  return (
    <div className='flex flex-col p-8 gap-8 items-stretch'>
      {showWarning && !session.data && data?.isOwner && (
        <div className=' rounded-lg border-2 border-amber-500 bg-amber-300 bg-opacity-25 p-4 grid grid-cols-[auto_1fr_auto] gap-x-4 self-center'>
          {' '}
          <ExclamationIcon
            className='text-yellow-500 row-span-2 self-center'
            height={30}
          />
          <div className='font-bold text-sm'>Warning: </div>
          <XIcon
            className='text-yellow-500'
            height={20}
            onClick={() => {
              setShowWarning(false);
            }}
          />
          <p className='font-light text-xs'>
            Your ability to manage this Poll is only temporary. Please sign in
            to secure your ownership.
          </p>
        </div>
      )}
      <div className='flex-1 bg-zinc-600 rounded-lg border-t-4 border-amber-500'>
        <div className='flex flex-col p-4 gap-4'>
          <div className='grid grid-cols-[1fr_auto]'>
            <Link key={id} href={`/poll/${id}`}>
              <div className='text-xl font-bold'>{data?.question}</div>
            </Link>
            <PollContextMenu id={id} isOwner={data.isOwner} />
          </div>
          <div className='grid gap-4 px-24 '>
            {data?.voteResults?.map((option, i) => (
              <div key={i} className='block'>
                {data?.hasVoted ? (
                  <>
                    <div className='flex justify-between mb-2'>
                      <span className='text-base font-medium '>
                        {option.text}
                      </span>
                      <span className='text-sm font-medium'>
                        {Math.round(option.percentage)}%
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                      <div
                        className={`${
                          backgrounds.current?.[
                            i % backgrounds.current?.length
                          ] || 'bg-amber-500'
                        } h-2.5 rounded-full`}
                        style={{ width: `${option.percentage}%` }}></div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div
                      className={`flex justify-center w-full py-1 px-4 rounded-md ${
                        backgrounds.current?.[
                          i % backgrounds.current?.length
                        ] || 'bg-amber-500'
                      } ${isLoading || isMutating ? 'opacity-50' : ''}`}
                      onClick={() => {
                        if (data?.hasVoted || isMutating || isLoading) return;
                        mutate({ pollId: id, choice: i });
                      }}>
                      <span className='text-base font-medium '>
                        {option.text}
                      </span>
                    </div>
                  </div>
                )}
                {/* <span>{option.text}</span>
              <span>
                Votes:{' '}
                {data?.votes?.[
                  data?.votes?.findIndex((vote) => vote.choice === i)
                ]?._count || 0}
              </span> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poll;
