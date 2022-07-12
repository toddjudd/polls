import { Menu, Transition } from '@headlessui/react';
import { HomeIcon, ChatAlt2Icon, LogoutIcon } from '@heroicons/react/solid';
import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

const AuthNav = () => {
  const { data: session } = useSession();

  if (!session)
    return (
      <div className='flex justify-center items-center '>
        <button
          onClick={() => signIn()}
          className='bg-amber-500 px-2 py-1 rounded-md'>
          Sign In
        </button>
      </div>
    );

  return (
    <div className='flex justify-center items-center rounded-full border-2 border-amber-500 self-center relative'>
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
                className='absolute top-[-16px] right-[-32px] w-40  origin-top-right bg-zinc-500 rounded-md shadow-lg outline-none z-10 -translate-y-2 translate-x-2'>
                <Menu.Button className='px-4 py-3 flex justify-between w-full z-10 items-center'>
                  <div className='text-xs'>{session.user?.name}</div>
                  <div className='border-2 border-amber-500 h-[32px] w-[32px] rounded-full'>
                    <Image
                      src={session.user?.image || ''}
                      height={32}
                      width={32}
                      alt='user image'
                      className='rounded-full '
                    />
                  </div>
                </Menu.Button>
                <Menu.Button className='px-4 py-3 flex justify-between w-full z-10'>
                  <p className='text-sm text-amber-500 font-medium leading-5 truncate'>
                    Sign Out
                  </p>
                  <LogoutIcon className='h-5 w-5 text-amber-500' />
                </Menu.Button>
              </Menu.Items>
            </Transition>
            <Menu.Button className='h-[32px] w-[32px]'>
              <Image
                src={session.user?.image || ''}
                height={32}
                width={32}
                alt='user image'
                className='rounded-full border-2 border-amber-500'
              />
            </Menu.Button>
          </>
        )}
      </Menu>
    </div>
  );
};

export const Layout: React.FC<{
  title?: string;
  children: ReactNode;
}> = ({ title, children }) => {
  return (
    <div>
      <Head>
        <title>{title ? `${title} | Soda Vote` : 'Soda Vote'}</title>
        <meta
          name='description'
          content='A polling app used to learn Next.js'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <nav className='sticky top-0 bg-zinc-700 border-b-[1px] border-b-zinc-300 z-50 h-16 flex justify-around'>
        <div className='flex gap-8 items-stretch font-bold h-full px-8 max-w-7xl flex-1'>
          <Link rel='stylesheet' href='/'>
            <span className='flex gap-2 text-4xl items-center'>
              <ChatAlt2Icon className='h-10 w-10 text-amber-500' />
              <span>SodaVote</span>
            </span>
          </Link>
          <Link href='/poll/create'>
            <span className='flex justify-center items-center'>
              Create Poll
            </span>
          </Link>
          <Link href='/'>
            <span className='flex justify-center items-center'>View Polls</span>
          </Link>
          <span className='flex-1'></span>
          <AuthNav />
        </div>
      </nav>
      <main className='grid grid-colls-1 lg:grid-cols-[auto_1fr] justify-stretch max-w-7xl m-auto'>
        <section className=' hidden lg:block'>
          <div className='w-[200px] flex felx-col p-4 sticky top-[69px]'>
            <Link href='/'>
              <span className='flex justify-center gap-4 w-full'>
                <HomeIcon className='h-5 w-5 text-zinc-300' />
                <span>Dashboard</span>
              </span>
            </Link>
          </div>
        </section>
        <section>{children}</section>
      </main>
    </div>
  );
};
