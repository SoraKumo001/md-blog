import { NextSSRProvider, createNextSSRExchange } from '@react-libraries/next-exchange-ssr';

import { useSession } from 'next-auth/react';
import { ReactNode, useMemo } from 'react';
import { cacheExchange, Client, fetchExchange, Provider } from 'urql';

const isServerSide = typeof window === 'undefined';
const endpoint = '/api/graphql';

export const UrqlProvider = ({
  host,
  cookie,
  children,
}: {
  host?: string;
  cookie?: string;
  children: ReactNode;
}) => {
  const session = useSession();
  const nextSSRExchange = useMemo(createNextSSRExchange, []);
  const client = useMemo(() => {
    const url = isServerSide ? `${host}${endpoint}` : endpoint;
    return new Client({
      url,
      fetchOptions: {
        headers: {
          'apollo-require-preflight': 'true',
          cookie: cookie ?? '',
        },
      },
      suspense: isServerSide,
      exchanges: [cacheExchange, nextSSRExchange, fetchExchange],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextSSRExchange, session]);
  return (
    <Provider value={client}>
      <NextSSRProvider>{children}</NextSSRProvider>
    </Provider>
  );
};
