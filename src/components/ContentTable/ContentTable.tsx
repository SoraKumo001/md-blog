import Link from 'next/link';
import React, { FC, useMemo } from 'react';
import { classNames } from '@/libs/classNames';
import { VNode } from '@/libs/MarkdownCompiler';
import styled from './ContentTable.module.scss';

export type MarkdownTitles = { text: string; depth: number }[];

interface Props {
  className?: string;
  title: string;
  vnode?: VNode;
}

/**
 * ContentTable
 *
 * @param {Props} { }
 */
export const ContentTable: FC<Props> = ({ className, title, vnode }) => {
  const titles = useMemo(() => {
    return vnode?.children?.flatMap((node) =>
      node.type !== 'heading' ? [] : ([[node.depth, convertText(node)]] as const)
    );
  }, [vnode]);
  return (
    <nav className={classNames(styled.root, className)}>
      <div className="border-b text-center font-bold">Index</div>
      <div className="flex-col p-2 text-xs">
        <Link href={`#header-top`} className="break-all">
          {title}
        </Link>
        <ul className="mt-2 flex flex-col gap-1">
          {titles?.map((node, index) => (
            <Link key={index} href={`#header-${index}`}>
              <li className="list-disc break-all" style={{ marginLeft: `${(node[0] + 1) * 12}px` }}>
                {node[1]}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </nav>
  );
};

const convertText = (node: VNode): string => {
  if (node.type === 'text') return node.value;
  return node.children?.map(convertText).join('') ?? '';
};
