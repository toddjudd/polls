import { PollQuestion } from '@prisma/client';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link, { LinkProps } from 'next/link';
import React, {
  forwardRef,
  Fragment,
  HTMLProps,
  RefAttributes,
  useState,
} from 'react';
import { Layout } from '../components/layout';
import { trpc } from '../utils/trpc';
import { Menu, Transition } from '@headlessui/react';
import { Listbox } from '@headlessui/react';
import {
  DotsVerticalIcon,
  TrashIcon,
  ChevronRightIcon,
} from '@heroicons/react/solid';

const PollCardContextMenu: React.FC<{ id: string }> = ({ id }) => {
  const context = trpc.useContext();
  const { mutate, data, isLoading } = trpc.useMutation('polls.delete-by-id', {
    onSettled: () => {
      context.invalidateQueries(['polls.get-all-by-user']);
    },
  });
  return (
    <div className='relative inline-block text-left'>
      <Menu>
        {({ open }) => (
          <>
            <Transition
              show={open}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
              className='relative z-10'>
              <Menu.Items
                static
                className='absolute top-0 right-0 w-40  origin-top-right bg-zinc-500 rounded-md shadow-lg outline-none z-10 -translate-y-2 translate-x-2'>
                <Menu.Button className='px-4 py-3 flex justify-end w-full z-10'>
                  <ChevronRightIcon className='h-5 w-5 ' />
                </Menu.Button>
                <Menu.Button
                  className='px-4 py-3 flex justify-between w-full z-10'
                  onClick={() => {
                    mutate({ id });
                  }}>
                  <p className='text-sm text-red-400 font-medium leading-5 truncate'>
                    Delete
                  </p>
                  <TrashIcon className='h-5 w-5 text-red-400' />
                </Menu.Button>
              </Menu.Items>
            </Transition>
            <Menu.Button className='p-1'>
              <DotsVerticalIcon className='h-5 w-5 ' />
            </Menu.Button>
          </>
        )}
      </Menu>
    </div>
  );
};

const PollFilterList = () => {
  const filters = ['Created', 'Participated'];
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

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
                  <Listbox.Button className='text-zinc-900 cursor-default relative w-full rounded-md border border-zinc-300 bg-zinc-100 pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5'>
                    <span className='block truncate'>{selectedFilter}</span>
                    <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                      <svg
                        className='h-5 w-5 text-gray-400'
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
                  className='absolute mt-1 w-full rounded-md bg-zinc-100 shadow-lg z-20'>
                  <Listbox.Options
                    static
                    className='max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5'>
                    {filters.map((person) => (
                      <Listbox.Option key={person} value={person}>
                        {({ selected, active }) => (
                          <div
                            className={`${
                              active
                                ? 'text-zinc-100 bg-amber-600'
                                : 'text-zinc-800'
                            } cursor-default select-none relative py-2 pl-8 pr-4`}>
                            <span
                              className={`${
                                selected ? 'font-semibold' : 'font-normal'
                              } block truncate`}>
                              {person}
                            </span>
                            {selected && (
                              <span
                                className={`${
                                  active ? 'text-zinc-100' : 'text-amber-600'
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

const PollCard: React.FC<PollQuestion> = ({ id, question }) => {
  return (
    <div
      key={id}
      className='p-4 border-b border-zinc-300 last-of-type:border-0'>
      <div className='grid grid-cols-[1fr_auto]'>
        <Link key={id} href={`/poll/${id}`}>
          <div className='text-xl font-bold'>{question}</div>
        </Link>
        <PollCardContextMenu id={id} />
      </div>
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
      <div className='p-4 py-10 flex flex-col gap-4 align-middle justify-around max-w-md'>
        <div>No polls yet</div>
        {/* <PollForm /> */}
      </div>
    );
  }
  return (
    <div className='max-w-4xl flex-1 bg-zinc-600 m-8 rounded-lg '>
      <div className='flex flex-col'>
        <div className='p-4 border-b border-zinc-300 last-of-type:border-0 flex justify-between'>
          <div className='text-xl font-bold'>Polls</div>
          <PollFilterList />
        </div>
        {data.map((poll, i, arr) => PollCard(poll))}
      </div>
    </div>
  );
};

export default Polls;
