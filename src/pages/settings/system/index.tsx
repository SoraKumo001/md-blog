import { SiteSetting } from '@/components/Settings/SiteSetting';

const Page = () => {
  return <SiteSetting />;
};
export default Page;

export const getStaticProps = async () => {
  return {
    props: {},
  };
};
