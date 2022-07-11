import { HomeIcon, ChatAlt2Icon } from '@heroicons/react/solid';
import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

export const Layout: React.FC<{
  title?: string;
  children: ReactNode;
}> = ({ title, children }) => {
  const { data: session } = useSession();
  return (
    <div>
      <Head>
        <title>{title ? `${title} | ` : ''}Soda Vote</title>
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
          {session ? (
            <button onClick={() => signOut()}>{session.user?.name}</button>
          ) : (
            <button onClick={() => signIn()}>Sign In</button>
          )}
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
