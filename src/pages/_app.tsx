import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppContext, AppProps } from 'next/app';
import { Noto_Sans_Mono, Roboto_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@/components/Commons/GoogleAnalytics';
import { UrqlProvider } from '@/components/Provider/UrqlProvider';
import { Header } from '@/components/System/Header';
import { LoadingContainer } from '@/components/System/LoadingContainer';
import { StoreProvider } from '@/libs/context';
import { getHost } from '@/libs/getHost';
// import { getUserInfo } from '@/libs/getUserInfo';
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

type Session = { email: string; name: string };

const App = ({
  Component,
  pageProps: { session, cookie, host },
}: AppProps<{ session?: Session; host?: string; cookie?: string }>) => {
  return (
    <StoreProvider initState={() => ({ host, user: session })}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <GoogleAnalytics />
        <UrqlProvider host={host} cookie={cookie}>
          <ThemeProvider theme={theme}>
            <div
              className={'flex h-screen flex-col'}
              style={{ fontFamily: `${roboto.style.fontFamily} ,${noto.style.fontFamily}` }}
            >
              <Header />
              <main className="relative flex-1 overflow-hidden">
                <Component />
              </main>
              <LoadingContainer />
            </div>
          </ThemeProvider>
        </UrqlProvider>
      </LocalizationProvider>
    </StoreProvider>
  );
};

class ServerString extends String {
  constructor(value: string) {
    super(value);
  }
  toJSON() {
    return undefined;
  }
}

App.getInitialProps = async (context: AppContext) => {
  const req = context?.ctx?.req;
  const host = getHost(req);
  const cookie = req?.headers?.cookie;
  const cookies = Object.fromEntries(cookie?.split(';').map((v) => v.trim().split('=')) ?? []);
  const token = cookies['auth-token'];
  const session =
    typeof window === 'undefined'
      ? // eslint-disable-next-line @typescript-eslint/no-var-requires
        await require('@/libs/getUserInfo').getUserInfo(process.env.NEXT_PUBLIC_projectId, token)
      : undefined;
  return {
    pageProps: {
      cookie: cookie && new ServerString(cookie),
      host,
      session: session && { name: session.name, email: session.email },
    },
  };
};

export default App;
