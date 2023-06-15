import LeftIcon from '@mui/icons-material/ArrowLeft';
import RightIcon from '@mui/icons-material/ArrowRight';
import CenterIcon from '@mui/icons-material/FilterCenterFocus';
import { Button } from '@mui/material';
import React, { FC, ReactNode, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { classNames } from '@/libs/classNames';
import styled from './Separator.module.scss';

interface Props {
  className?: string;
  children: [ReactNode, ReactNode];
}

/**
 * Separator
 *
 * @param {Props} { }
 */
export const Separator: FC<Props> = ({ className, children }) => {
  const [rato, setRato] = useState(0.5);
  const refSeparator = useRef<HTMLDivElement>(null);
  const property = useRef({ isDrag: false, x: 0 }).current;
  useEffectOnce(() => {
    const handleMouseUp = () => {
      property.isDrag = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      const node = refSeparator.current;
      const parent = node?.parentElement;
      if (property.isDrag && node && parent) {
        const x = e.pageX - parent.getBoundingClientRect().left - property.x;
        const width = x / (parent.clientWidth - node.clientWidth);
        setRato(width);
      }
    };
    addEventListener('mouseup', handleMouseUp);
    addEventListener('mousemove', handleMouseMove);
    return () => {
      removeEventListener('mouseup', handleMouseUp);
      removeEventListener('mousemove', handleMouseMove);
    };
  });
  return (
    <div className={classNames(styled.root, className)}>
      <div className={styled.client} style={{ flex: rato }}>
        {children[0]}
      </div>
      <div
        className={styled.separator}
        ref={refSeparator}
        onMouseDown={(e) => {
          property.isDrag = true;
          property.x = e.pageX - e.currentTarget.getBoundingClientRect().left;
          e.preventDefault();
        }}
      >
        <Button
          className="w-6"
          type="button"
          variant="contained"
          onClick={(e) => {
            setRato(0);
            e.preventDefault();
          }}
          aria-label="left"
        >
          <LeftIcon className="w-6" />
        </Button>
        <Button
          className="w-6"
          type="button"
          variant="contained"
          onClick={(e) => {
            setRato(0.5);
            e.preventDefault();
          }}
          aria-label="center"
        >
          <CenterIcon className="w-6" />
        </Button>
        <Button
          className="w-6"
          type="button"
          variant="contained"
          onClick={(e) => {
            setRato(1);
            e.preventDefault();
          }}
          aria-label="right"
        >
          <RightIcon className="w-6" />
        </Button>
      </div>
      <div className={styled.client} style={{ flex: 1 - rato }}>
        {children[1]}
      </div>
    </div>
  );
};
