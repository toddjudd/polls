import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

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
      <main className='bg-zinc-600 m-8 rounded-lg '>{children}</main>
    </div>
  );
};
