'use client';

import { ReactNode } from 'react';
import { GoogleAnalytics } from '@/components/Commons/GoogleAnalytics';
import { UrqlProvider } from '@/components/Provider/UrqlProvider';
import { Header } from '@/components/System/Header';
import { LoadingContainer } from '@/components/System/LoadingContainer';
import { NotificationContainer } from '@/components/System/Notification/NotificationContainer';
import { StoreProvider } from '@/libs/context';

type Session = { email: string; name: string };

type Props = {
  children: ReactNode;
  session?: Session;
  host?: string;
  cookie?: string;
};

export const App = ({ children, host, session, cookie }: Props) => {
  return (
    <StoreProvider initState={() => ({ host, user: session })}>
      <GoogleAnalytics />
      <UrqlProvider host={host} cookie={cookie}>
        <Header />
        <main className="relative flex-1 overflow-hidden">{children}</main>
        <LoadingContainer />
        <NotificationContainer />
      </UrqlProvider>
    </StoreProvider>
  );
};
