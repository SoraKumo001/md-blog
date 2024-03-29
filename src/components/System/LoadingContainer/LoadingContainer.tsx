import React, { FC } from 'react';
import { MdRefresh as IconRefresh } from 'react-icons/md';
import { useSelector } from '@/libs/context';
import styled from './LoadingContainer.module.scss';

interface Props {}

/**
 * LoadingContainer
 *
 * @param {Props} { }
 */
export const LoadingContainer: FC<Props> = ({}) => {
  const loading = useSelector((v: { loading?: number }) => v.loading);
  return loading ? (
    <div className={styled.root}>
      <IconRefresh />
    </div>
  ) : null;
};
