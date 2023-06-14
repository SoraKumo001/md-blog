import { useRouter } from 'next/router';
import { Contents } from '@/components/Contents';

const Page = () => {
  const router = useRouter();
  const id = router.query['id'];
  if (typeof id !== 'string') return null;
  return <Contents id={id} />;
};
export default Page;
