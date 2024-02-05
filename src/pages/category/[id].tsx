import { useRouter } from 'next/router';
import { Categories } from '@/components/Pages/Categories';

const Page = () => {
  const router = useRouter();
  const id = router.query['id'];
  if (typeof id !== 'string') return null;
  return <Categories id={id} />;
};
export default Page;
export const runtime = 'experimental-edge';
