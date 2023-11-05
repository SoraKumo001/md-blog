import { Noto_Sans_Mono, Roboto_Mono } from 'next/font/google';
import { headers, cookies } from 'next/headers';
import { getHost } from '@/libs/getHost';
import { getUserFromToken } from '@/libs/getUserFromToken';
import { App } from './App';
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
import '@/styles/globals.scss';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = getHost(Object.fromEntries(headers().entries()));
  const token = cookies().get('auth-token')?.value;
  const session = await getUserFromToken(token);

  return (
    <html
      lang="en"
      className={[noto.className, roboto.className, 'flex h-screen flex-col'].join(' ')}
    >
      <body>
        <App host={host} session={session}>
          {children}
        </App>
      </body>
    </html>
  );
}