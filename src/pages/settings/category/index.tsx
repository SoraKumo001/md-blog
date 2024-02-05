import { CategorySetting } from '@/components/Settings/CategorySetting';

const Page = () => {
  return <CategorySetting />;
};
export default Page;
export const runtime = 'experimental-edge';

export const getStaticProps = async () => {
  return {
    props: {},
  };
};
