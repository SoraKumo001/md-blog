import { useRouter } from 'next/router';
import { Editor } from '@/components/MarkdownEditor/Editor';

const Page = () => {
  const router = useRouter();
  const id = router.query['id'];
  if (typeof id !== 'string' || typeof window === 'undefined') return null;
  return <Editor id={id} />;
};
export default Page;
