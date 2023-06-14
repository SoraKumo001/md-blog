import { GetServerSideProps } from 'next';
import ErrorPage from 'next/error';

type Props = {
  code: number;
};

const Page = ({ code }: Props) => <ErrorPage statusCode={code} />;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, res }) => {
  const code = Number(query.code);
  res.statusCode = code;
  return { props: { code } };
};

export default Page;
