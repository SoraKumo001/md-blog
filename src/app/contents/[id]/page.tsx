'use client';

import { useParams } from 'next/navigation';
import { Contents } from '@/components/Contents';

const Page = () => {
  const p = useParams();
  const id = p?.id;
  if (typeof id !== 'string') return null;
  return <Contents id={id} />;
};
export default Page;
