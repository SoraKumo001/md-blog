import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppProps } from 'next/app';
import { Noto_Sans_Mono, Roboto_Mono } from 'next/font/google';
import Head from 'next/head';
import { Session } from 'next-auth';
import { GetSessionParams, SessionProvider, getSession } from 'next-auth/react';
import { UrqlProvider } from '@/components/Provider/UrqlProvider';
import { Header } from '@/components/System/Header';
import { LoadingContainer } from '@/components/System/LoadingContainer';
import { StoreProvider } from '@/libs/context';
import { theme } from '@/styles/themes';
import '@/styles/globals.scss';

const noto = Noto_Sans_Mono({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const roboto = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const App = ({
  Component,
  pageProps: { session, cookie, host, ...pageProps },
}: AppProps<{ session: Session; host?: string; cookie?: string }>) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <link rel="alternate" type="application/rss+xml" href="/sitemap.xml" title="RSS2.0" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <UrqlProvider host={host} cookie={cookie}>
          <StoreProvider>
            <ThemeProvider theme={theme}>
              <div
                className={'flex h-screen flex-col'}
                style={{ fontFamily: `${roboto.style.fontFamily} ,${noto.style.fontFamily}` }}
              >
                <Head>
                  <meta charSet="UTF-8" />
                  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                  <meta
                    name="viewport"
                    content="width=device-width,minimum-scale=1,initial-scale=1"
                  />
                </Head>
                <Header />
                <main className="relative flex-1 overflow-hidden">
                  <Component {...pageProps} />
                </main>
                <LoadingContainer />
              </div>
            </ThemeProvider>
          </StoreProvider>
        </UrqlProvider>
      </LocalizationProvider>
    </SessionProvider>
  );
};

App.getInitialProps = async (context: GetSessionParams | undefined) => {
  const headers = context?.ctx?.req?.headers;
  return {
    pageProps: {
      session: typeof window === 'undefined' ? await getSession(context) : undefined,
      cookie: context?.ctx?.req?.headers?.cookie,
      host: headers
        ? `${headers['x-forwarded-proto']}://${headers['x-forwarded-host']}`
        : undefined,
    },
  };
};

export default App;
