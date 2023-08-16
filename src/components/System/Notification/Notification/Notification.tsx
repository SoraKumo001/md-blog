import IconInfo from '@mui/icons-material/InfoOutlined';
import React, { AnimationEventHandler, FC } from 'react';
import styled from './Notification.module.scss';
interface Props {
  onClose?: () => void;
  onAnimationEnd?: AnimationEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

/**
 * Notification
 *
 * @param {Props} { }
 */
export const Notification: FC<Props> = ({ onAnimationEnd, children }) => {
  return (
    <div className={styled.root} onAnimationEnd={onAnimationEnd}>
      <div className={styled.message}>
        <IconInfo />
        {children}
      </div>
    </div>
  );
};
