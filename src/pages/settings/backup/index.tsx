import { Backup } from '@/components/Settings/Backup';

const Page = () => {
  return <Backup />;
};
export default Page;
export const runtime = 'experimental-edge';

export const getStaticProps = async () => {
  return {
    props: {},
  };
};
