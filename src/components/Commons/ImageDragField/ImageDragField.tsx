import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import React, { FC, ReactNode, useState } from 'react';
import { classNames } from '@/libs/classNames';
import styled from './ImageDragField.module.scss';

interface Props {
  className?: string;
  children?: ReactNode;
  types?: ('png' | 'jpeg' | 'x-icon' | 'webp')[];
  placeholder?: string;
  url?: string;
  onChange?: (value: Blob | null) => void;
}

/**
 * DragArea
 *
 * @param {Props} { }
 */
export const ImageDragField: FC<Props> = ({
  className,
  placeholder,
  types = ['png', 'jpeg', 'x-icon', 'webp'],
  onChange,
  url,
}) => {
  const [isDrag, setDrag] = useState(false);
  const [image, setImage] = useState(url);
  return (
    <FormControl fullWidth className={classNames(styled.root, className)}>
      {placeholder && (
        <InputLabel shrink={!!image} focused={false} className={styled.placeholder}>
          {placeholder}
        </InputLabel>
      )}
      <div
        className={classNames(styled.field, isDrag && styled.drag)}
        onDragOver={(e) => {
          setDrag(true);
          e.preventDefault();
        }}
        onDragLeave={() => {
          setDrag(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) {
            const type = file.type.split('/')[1];
            if (!type || !types.includes(type as (typeof types)[number])) return;
            convertUrl(file, type).then(setImage);
            onChange?.(file);
          }
        }}
      >
        {image && (
          <Button
            size="small"
            className={styled.close}
            onClick={() => {
              onChange?.(null);
              setImage(undefined);
            }}
            aria-label="close"
          >
            <CloseIcon />
          </Button>
        )}
        {image && <img className={styled.image} src={image} alt={placeholder || ''} />}
      </div>
    </FormControl>
  );
};

const convertUrl = async (blob: Blob | undefined | null, type: string) => {
  if (!blob) return undefined;
  return `data:image/${type};base64,` + Buffer.from(await blob.arrayBuffer()).toString('base64');
};
