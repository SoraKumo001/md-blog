import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';
import { Button } from 'react-daisyui';
import {
  MdCreate as CreateIcon,
  MdHome as HomeIcon,
  MdLogin as LoginIcon,
  MdLogout as LogoutIcon,
  MdSettings as SettingsIcon,
} from 'react-icons/md';
import { useSystemQuery } from '@/generated/graphql';
import { useUser, useSignOut } from '@/hooks/useAuth';
import { useLoading } from '@/hooks/useLoading';
import { getFirebaseUrl } from '@/libs/getFirebaseUrl';
import styled from './Header.module.scss';

interface Props {}

/**
 * Header
 *
 * @param {Props} { }
 */
export const Header: FC<Props> = () => {
  const router = useRouter();
  const session = useUser();
  const [{ data, fetching }] = useSystemQuery();
  const signOut = useSignOut();
  useLoading(fetching);
  if (!data) return null;
  const favicon = data.findUniqueSystem.icon && getFirebaseUrl(data.findUniqueSystem.icon.id);
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <meta name="description" content={data.findUniqueSystem.description} />
        <link rel="alternate" type="application/rss+xml" href="/sitemap.xml" title="RSS2.0" />
        {favicon && <link rel="icon" href={favicon} />}
      </Head>
      <header className={styled.root}>
        <Link className={styled.title} href="/">
          <HomeIcon fontSize="large" size={24} />
          {data.findUniqueSystem.title}
        </Link>
        <div className="flex gap-1">
          {session && (
            <>
              <Button
                variant="outline"
                color="primary"
                size="sm"
                onClick={() => {
                  router.push('/edit');
                }}
                aria-label="create post"
              >
                <CreateIcon size={24} />
              </Button>
              <Button
                variant="outline"
                color="primary"
                size="sm"
                onClick={() => {
                  router.push('/settings');
                }}
                aria-label="setting"
              >
                <SettingsIcon size={24} />
              </Button>
              <Button
                variant="outline"
                color="primary"
                size="sm"
                onClick={() => {
                  signOut();
                }}
                aria-label="logout"
              >
                <LogoutIcon size={24} />
              </Button>
            </>
          )}

          {!session && (
            <Button
              variant="outline"
              color="primary"
              size="sm"
              onClick={() => {
                router.push('/login');
              }}
              aria-label="login"
            >
              <LoginIcon size={24} />
            </Button>
          )}
        </div>
      </header>
    </>
  );
};
