'use client';

import { useParams } from 'next/navigation';
import { Categories } from '@/components/Pages/Categories';

const Page = () => {
  const params = useParams();
  const id = params?.id;
  if (typeof id !== 'string') return null;
  return <Categories id={id} />;
};
export default Page;
