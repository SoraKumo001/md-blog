'use client';
import { useParams } from 'next/navigation';
import { Editor } from '@/components/MarkdownEditor/Editor';

const Page = () => {
  const params = useParams();
  const id = params?.id;
  if (typeof id !== 'string') return null;
  return <Editor id={id} />;
};
export default Page;
