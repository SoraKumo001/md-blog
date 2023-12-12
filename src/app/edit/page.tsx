'use client';

import { useRouter } from 'next/navigation';
import { useEffectOnce } from 'react-use';
import { useCreateOnePostMutation } from '@/generated/graphql';

const Page = () => {
  const router = useRouter();
  const [, createPost] = useCreateOnePostMutation();
  useEffectOnce(() => {
    createPost({}).then(({ data }) => {
      const id = data?.createOnePost?.id;
      id && router.replace(`/edit/${id}`);
    });
  });
};
export default Page;
export const runtime = 'edge';
