import React, { FC, ReactNode, useState } from 'react';
import { Button } from 'react-daisyui';
import { MdClose as CloseIcon } from 'react-icons/md';
import { classNames } from '@/libs/classNames';
import styled from './ImageDragField.module.scss';
import { FieldSet } from '../FieldSet';

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
    <FieldSet
      className={classNames(styled.root, styled.field, isDrag && styled.drag, className)}
      label={placeholder}
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
          type="button"
          variant="link"
          className={styled.close}
          onClick={() => {
            onChange?.(null);
            setImage(undefined);
          }}
          aria-label="close"
        >
          <CloseIcon size={24} />
        </Button>
      )}
      {image && <img className={styled.image} src={image} alt={placeholder || ''} />}
    </FieldSet>
  );
};

const convertUrl = async (blob: Blob | undefined | null, type: string) => {
  if (!blob) return undefined;
  return `data:image/${type};base64,` + Buffer.from(await blob.arrayBuffer()).toString('base64');
};
