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
      <div className="max-w-2xl m-auto grid gap-8">
        <h1>システム設定</h1>
        <div className={styled.items}>
          <Link className={styled.link} href="/settings/system">
            サイト設定
          </Link>
          <Link className={styled.link} href="/settings/category">
            カテゴリ設定
          </Link>
          <Link className={styled.link} href="/settings/backup">
            バックアップ/リストア
          </Link>
        </div>
      </div>
    </div>
  );
};
