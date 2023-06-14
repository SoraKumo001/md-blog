import React, { FC, ReactNode } from 'react';
import { classNames } from '@/libs/classNames';
import styled from './ContentMarkdown.module.scss';

interface Props {
  className?: string;
  onClick?: (line: number, offset: number) => void;
  children?: ReactNode;
}

/**
 * ContentMarkdown
 *
 * @param {Props} { }
 */
export const ContentMarkdown: FC<Props> = ({ className, onClick, children }) => {
  return (
    <div
      className={classNames(styled.root, className)}
      onClick={(e) => {
        let node = e.target as HTMLElement | null;
        while (node && !node.dataset.sourcepos) {
          node = node.parentElement;
        }
        if (node) {
          onClick?.(Number(node.dataset.sourcepos), node.offsetTop);
        }
      }}
    >
      {children}
    </div>
  );
};
