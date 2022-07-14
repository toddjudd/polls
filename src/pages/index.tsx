import { Transition, Listbox } from '@headlessui/react';
import { PollQuestion } from '@prisma/client';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import PollContextMenu from '../components/Poll/PollContextMenu';
import { PollFilterValidatorType } from '../shared/poll-filter-validator';
import { trpc } from '../utils/trpc';

const PollFilterList: React.FC<{
  filters: PollFilterValidatorType[];
  selectedFilter: PollFilterValidatorType;
  setSelectedFilter: React.Dispatch<
    React.SetStateAction<PollFilterValidatorType>
  >;
}> = ({ filters, selectedFilter, setSelectedFilter }) => {
  return (
    <div className='flex items-center justify-center min-w-[130px]'>
      <div className='w-full max-w-xs mx-auto'>
        <Listbox
          as='div'
          className='space-y-1'
          value={selectedFilter}
          onChange={setSelectedFilter}>
          {({ open }) => (
            <>
              <div className='relative'>
                <span className='inline-block w-full rounded-md shadow-sm'>
                  <Listbox.Button className='bg-zinc-500  cursor-default relative w-full rounded-md border border-zinc-500 pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5'>
                    <span className='block truncate'>
                      {selectedFilter.filter}
                    </span>
                    <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                      <svg
                        className='h-5 w-5 '
                        viewBox='0 0 20 20'
                        fill='none'
                        stroke='currentColor'>
                        <path
                          d='M7 7l3-3 3 3m0 6l-3 3-3-3'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </span>
                  </Listbox.Button>
                </span>

                <Transition
                  show={open}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                  className='absolute mt-1 w-full rounded-md bg-zinc-500 shadow-lg z-20'>
                  <Listbox.Options
                    static
                    className='max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5'>
                    {filters.map((filterObj) => (
                      <Listbox.Option key={filterObj.filter} value={filterObj}>
                        {({ selected, active }) => (
                          <div
                            className={`${
                              active ? ' bg-amber-600' : ''
                            } cursor-default select-none relative py-2 pl-8 pr-4`}>
                            <span
                              className={`${
                                selected ? 'font-semibold' : 'font-normal'
                              } block truncate`}>
                              {filterObj.filter}
                            </span>
                            {selected && (
                              <span
                                className={`${
                                  active ? '0' : 'text-amber-600'
                                } absolute inset-y-0 left-0 flex items-center pl-1.5`}>
                                <svg
                                  className='h-5 w-5'
                                  xmlns='http://www.w3.org/2000/svg'
                                  viewBox='0 0 20 20'
                                  fill='currentColor'>
                                  <path
                                    fillRule='evenodd'
                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                              </span>
                            )}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
    </div>
  );
};

const PollCard: React.FC<PollQuestion & { isOwner: boolean }> = ({
  id,
  question,
  isOwner,
}) => {
  return (
    <div
      key={id}
      className='p-4 border-b border-zinc-300 last-of-type:border-0'>
      <div className='grid grid-cols-[1fr_auto]'>
        <Link key={id} href={`/poll/${id}`}>
          <div className='text-xl font-bold'>{question}</div>
        </Link>
        <PollContextMenu id={id} isOwner={isOwner} />
      </div>
    </div>
  );
};

const Polls: NextPage = () => {
  const context = trpc.useContext();
  const filters = useRef<PollFilterValidatorType[]>([
    { filter: 'Public' },
    { filter: 'Created' },
    { filter: 'Participated' },
  ]);
  const [selectedFilter, setSelectedFilter] = useState<PollFilterValidatorType>(
    filters.current[0] || { filter: 'Created' }
  );
  const { data, isLoading } = trpc.useQuery([
    'polls.get-all',
    { filter: selectedFilter.filter },
  ]);
  useEffect(() => {
    context.invalidateQueries('polls.get-all');
  }, [context, selectedFilter.filter]);

  if (isLoading || !data) {
    return (
      <div className='max-w-4xl flex-1 bg-zinc-600 m-8 rounded-lg '>
        <div className='flex flex-col'>
          <div className='p-4 border-b border-zinc-300 last-of-type:border-0 flex justify-between'>
            <div className='text-xl font-bold'>Loading</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='max-w-4xl flex-1 bg-zinc-600 m-8 rounded-lg '>
      <div className='flex flex-col'>
        <div className='p-4 border-b border-zinc-300 last-of-type:border-0 flex justify-between'>
          <div className='text-xl font-bold'>Polls</div>
          <PollFilterList
            {...{ filters: filters.current, selectedFilter, setSelectedFilter }}
          />
        </div>
        {!isLoading && data.length === 0 ? (
          <div className='p-4 flex flex-col justify-center items-center gap-4'>
            <div className='font-bold'>
              No {selectedFilter.filter} polls yet
            </div>
            <Link href={`/poll/create`}>
              <button className='rounded-md px-4 py-1 bg-amber-500'>
                Create Poll
              </button>
            </Link>
          </div>
        ) : (
          data.map((poll) => PollCard(poll))
        )}
      </div>
    </div>
  );
};

export default Polls;
