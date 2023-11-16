import { headers, cookies } from 'next/headers';
import { getHost } from '@/libs/getHost';
import { getUserFromToken } from '@/libs/getUserFromToken';
import { App } from './App';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = getHost(Object.fromEntries(headers().entries()));
  const token = cookies().get('auth-token')?.value;
  const session = await getUserFromToken(token);
  return (
    <App host={host} session={session}>
      {children}
    </App>
  );
}
