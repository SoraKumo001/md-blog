import CreateIcon from '@mui/icons-material/Create';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import React, { FC } from 'react';
import { useSystemQuery } from '@/generated/graphql';
import { useLoading } from '@/hooks/useLoading';
import styled from './Header.module.scss';

interface Props {}

/**
 * Header
 *
 * @param {Props} { }
 */
export const Header: FC<Props> = ({}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [{ data, fetching }] = useSystemQuery();
  useLoading(fetching);
  if (!data) return null;
  return (
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
            >
              <CreateIcon />
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                router.push('/system');
              }}
            >
              <SettingsIcon />
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                signOut({ redirect: false });
              }}
            >
              <LogoutIcon />
            </Button>
          </>
        )}

        {!session && (
          <Button
            variant="outlined"
            onClick={() => {
              signIn();
            }}
          >
            <LoginIcon />
          </Button>
        )}
      </div>
    </header>
  );
};
