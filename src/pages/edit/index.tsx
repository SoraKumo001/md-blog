import { useRouter } from 'next/router';
import { useEffectOnce } from 'react-use';
import { useUpdatePostMutation } from '@/generated/graphql';

const Page = () => {
  const router = useRouter();
  const [, updatePost] = useUpdatePostMutation();
  useEffectOnce(() => {
    updatePost({}).then(({ data }) => {
      const id = data?.updateOnePost?.id;
      id && router.replace(`/edit/${id}`);
    });
  });
};
export default Page;
