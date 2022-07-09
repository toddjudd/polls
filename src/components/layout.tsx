import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';
import { HomeIcon } from '@heroicons/react/solid';

export const Layout: React.FC<{
  title: string;
  children: ReactNode;
}> = ({ title, children }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta
          name='description'
          content='A polling app used to learn Next.js'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <nav className='bg-zinc-600 m-8 rounded-lg flex flex-col'>
        <div className='flex justify-between p-4'>
          <Link rel='stylesheet' href='/'>
            🏠
          </Link>
          <div className='text-xl font-bold'>{title}</div>
          <Link href='/poll/create'>
            <div className='bg-zinc-300 text-sm text-zinc-600  p-2 rounded-md'>
              Create Question
            </div>
          </Link>
        </div>
      </nav>
      <main className='grid grid-cols-[auto_1fr] justify-stretch max-w-6xl m-auto'>
        <section className='w-[200px] flex felx-col p-4'>
          <Link href='/'>
            <span className='flex justify-center gap-4 w-full'>
              <HomeIcon className='h-5 w-5 text-zinc-300' />
              <span>Dashboard</span>
            </span>
          </Link>
        </section>
        <section>{children}</section>
      </main>
    </div>
  );
};
