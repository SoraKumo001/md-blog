import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import React, { FC, ReactNode } from 'react';
import styled from './MessageDialog.module.scss';

interface Props {
  isOpen: boolean;
  onResult?: (result: boolean) => void;
  children: ReactNode;
}

/**
 * MessageDialog
 *
 * @param {Props} { }
 */
export const MessageDialog: FC<Props> = ({ isOpen, onResult, children }) => {
  return (
    <Dialog
      className={styled.root}
      open={isOpen}
      keepMounted
      onClose={() => onResult?.(false)}
      aria-labelledby="common-dialog-title"
      aria-describedby="common-dialog-description"
    >
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={() => onResult?.(true)} color="primary" aria-label="yes">
          Yes
        </Button>
        <Button onClick={() => onResult?.(false)} color="primary" aria-label="no">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};
