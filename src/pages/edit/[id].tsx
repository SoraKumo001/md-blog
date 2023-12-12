import { useRouter } from 'next/router';
import { Editor } from '@/components/MarkdownEditor/Editor';

const Page = () => {
  const router = useRouter();
  const id = router.query['id'];
  if (typeof id !== 'string') return null;
  return <Editor id={id} />;
};
export default Page;

// export const runtime = 'experimental-edge';
