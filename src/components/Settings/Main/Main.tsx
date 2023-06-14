import { Container } from '@mui/material';
import React, { FC } from 'react';
import styled from './Main.module.scss';
import { CategorySetting } from '../CategorySetting';
import { SiteSetting } from '../SiteSetting';

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
          <SiteSetting />
          <CategorySetting />
        </div>
      </Container>
    </div>
  );
};
