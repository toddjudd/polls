import { Menu, Transition } from '@headlessui/react';
import {
  ChevronRightIcon,
  DotsVerticalIcon,
  TrashIcon,
} from '@heroicons/react/solid';

import { trpc } from '../../utils/trpc';

const PollContextMenu: React.FC<{ id: string; isOwner: boolean }> = ({
  id,
  isOwner,
}) => {
  const context = trpc.useContext();
  const { mutate } = trpc.useMutation('polls.delete-by-id', {
    onSettled: () => {
      context.invalidateQueries(['polls.get-all']);
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
                {isOwner && (
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
                )}
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

export default PollContextMenu;
