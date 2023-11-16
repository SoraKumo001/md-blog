'use client';
import { Noto_Sans_Mono, Roboto_Mono } from 'next/font/google';
import { ReactNode } from 'react';
import { GoogleAnalytics } from '@/components/Commons/GoogleAnalytics';
import { UrqlProvider } from '@/components/Provider/UrqlProvider';
import { Header } from '@/components/System/Header';
import { LoadingContainer } from '@/components/System/LoadingContainer';
import { NotificationContainer } from '@/components/System/Notification/NotificationContainer';
import { StoreProvider } from '@/libs/context';

import '@/styles/globals.scss';

type Session = { email: string; name: string };

type Props = {
  children: ReactNode;
  session?: Session;
  host?: string;
  cookie?: string;
};

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

export const App = ({ children, host, session, cookie }: Props) => {
  return (
    <html lang="en" className={[noto.className, roboto.className].join(' ')}>
      <body className="flex h-screen flex-col">
        <StoreProvider initState={() => ({ host, user: session })}>
          <GoogleAnalytics />
          <UrqlProvider host={host} cookie={cookie}>
            <Header />
            <main className="relative flex-1 overflow-hidden">{children}</main>
            <LoadingContainer />
            <NotificationContainer />
          </UrqlProvider>
        </StoreProvider>
      </body>
    </html>
  );
};
