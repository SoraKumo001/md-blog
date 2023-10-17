import Container from '@mui/material/Container';
import React, { FC, useState } from 'react';
import { useRestoreMutation } from '@/generated/graphql';
import { useLoading } from '@/hooks/useLoading';
import { useNotification } from '@/hooks/useNotification';
import styled from './Backup.module.scss';

interface Props {}

/**
 * Backup
 *
 * @param {Props} { }
 */
export const Backup: FC<Props> = ({}) => {
  const [{ fetching }, restore] = useRestoreMutation();
  const [download, setDownload] = useState(false);
  const notification = useNotification();
  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        restore({ file }).then(({ error }) => {
          if (error) {
            notification(error.message);
          } else {
            notification('リストアしました');
          }
        });
      }
    };
    input.click();
  };
  const handleBackup = async () => {
    setDownload(true);
    fetch('/api/backup', { method: 'POST' })
      .then(async (res) => {
        const blob = await res.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `export.json`;
        a.click();
        setDownload(false);
      })
      .catch(() => {
        setDownload(false);
      });
  };
  useLoading(fetching || download);
  return (
    <div className={styled.root}>
      <Container maxWidth="sm" sx={{ pt: 5 }}>
        <h1>バックアップ/リストア</h1>
        <div className={styled.items}>
          <a className={styled.link} onClick={handleBackup}>
            バックアップ
          </a>
          <a className={styled.link} onClick={handleRestore}>
            リストア
          </a>
        </div>
      </Container>
    </div>
  );
};
