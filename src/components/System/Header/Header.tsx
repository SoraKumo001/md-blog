import CreateIcon from '@mui/icons-material/Create';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
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
  const favicon = data.System.icon && getFirebaseUrl(data.System.icon.id);
  console.log({ session });
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <meta name="description" content={data.System.description} />
        <link rel="alternate" type="application/rss+xml" href="/sitemap.xml" title="RSS2.0" />
        {favicon && <link rel="icon" href={favicon} />}
      </Head>
      <header className={styled.root}>
        <Link className={styled.title} href="/">
          <HomeIcon fontSize="large" />
          {data.System.title}
        </Link>
        <div className="flex gap-1">
          {session && (
            <>
              <Button
                variant="outlined"
                onClick={() => {
                  router.push('/edit');
                }}
                aria-label="create post"
              >
                <CreateIcon />
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  router.push('/settings');
                }}
                aria-label="setting"
              >
                <SettingsIcon />
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  signOut();
                }}
                aria-label="logout"
              >
                <LogoutIcon />
              </Button>
            </>
          )}

          {!session && (
            <Button
              variant="outlined"
              onClick={() => {
                router.push('/login');
                // signIn();
              }}
              aria-label="login"
            >
              <LoginIcon />
            </Button>
          )}
        </div>
      </header>
    </>
  );
};
