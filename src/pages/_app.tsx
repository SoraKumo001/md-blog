import { AppContext, AppProps } from 'next/app';
import { Noto_Sans_Mono, Roboto_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@/components/Commons/GoogleAnalytics';
import { UrqlProvider } from '@/components/Provider/UrqlProvider';
import { Header } from '@/components/System/Header';
import { LoadingContainer } from '@/components/System/LoadingContainer';
import { NotificationContainer } from '@/components/System/Notification/NotificationContainer';
import { StoreProvider } from '@/libs/context';
import { getHost } from '@/libs/getHost';

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
  pageProps,
}: AppProps<{ session?: Session; host?: string; cookie?: string }>) => {
  const { session, cookie, host } = pageProps;
  return (
    <StoreProvider initState={() => ({ host, user: session })}>
      <GoogleAnalytics />
      <UrqlProvider host={host} cookie={cookie}>
        <div
          className={'flex h-screen flex-col'}
          style={{ fontFamily: `${roboto.style.fontFamily} ,${noto.style.fontFamily}` }}
        >
          <Header />
          <main className="relative flex-1 overflow-hidden">
            <Component {...pageProps} />
          </main>
          <LoadingContainer />
          <NotificationContainer />
        </div>
      </UrqlProvider>
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
      ? await import('@/libs/getUserFromToken').then((v) => v.getUserFromToken(token))
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
