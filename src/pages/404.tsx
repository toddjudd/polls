import { Layout } from '../components/layout';

export default function NotFound() {
  return (
    <Layout title='404'>
      <div className='p-4 grid gap-2 max-w-2xl m-[auto]'>
        <div className='justify-self-center text-4xl'>404</div>
        <div className='justify-self-center text-4xl'>Not found</div>
      </div>
    </Layout>
  );
}
