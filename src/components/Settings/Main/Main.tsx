import { Container } from '@mui/material';

import Link from 'next/link';
import React, { FC } from 'react';
import styled from './Main.module.scss';

interface Props {}

/**
 * Main
 *
 * @param {Props} { }
 */
export const Main: FC<Props> = ({}) => {
  return (
    <div className={styled.root}>
      <Container maxWidth="sm" sx={{ pt: 5 }}>
        <h1>システム設定</h1>
        <div className={styled.items}>
          <Link className={styled.link} href="/settings/system">
            サイト設定
          </Link>
          <Link className={styled.link} href="/settings/category">
            カテゴリ設定
          </Link>
        </div>
      </Container>
    </div>
  );
};
