import React, { FC, useState } from 'react';
import { Button } from 'react-daisyui';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ImageDragField } from '@/components/Commons/ImageDragField';
import { TextField } from '@/components/Commons/TextField';
import {
  useSystemQuery,
  useUpdateSystemMutation,
  useUploadSystemIconMutation,
} from '@/generated/graphql';
import { useLoading } from '@/hooks/useLoading';
import { getFirebaseUrl } from '@/libs/getFirebaseUrl';
import styled from './SiteSetting.module.scss';

interface FormInput {
  title: string;
  description: string;
}

interface Props {}

/**
 * Site
 *
 * @param {Props} { }
 */
export const SiteSetting: FC<Props> = ({}) => {
  const { register, handleSubmit } = useForm<FormInput>();
  const [{ data, fetching }] = useSystemQuery();
  const [{ fetching: mutationFetching }, updateSystem] = useUpdateSystemMutation();
  const [, uploadSystemIcon] = useUploadSystemIconMutation();
  const [icon, setIcon] = useState<Blob | null | undefined>();
  const onSubmit: SubmitHandler<FormInput> = ({ title, description }) => {
    updateSystem({ title, description, icon: icon === null ? { disconnect: true } : undefined });
    if (icon) {
      uploadSystemIcon({ file: icon });
    }
  };
  useLoading([fetching, mutationFetching]);
  if (!data) return null;
  const url = getFirebaseUrl(data.findUniqueSystem.icon?.id);
  return (
    <div className={styled.root}>
      <div className="max-w-2xl m-auto p-8">
        <div className="grid gap-8">
          <h1>サイト情報</h1>
          <TextField
            label="タイトル"
            defaultValue={data.findUniqueSystem.title}
            {...register('title')}
          />
          <TextField
            label="説明"
            defaultValue={data.findUniqueSystem.description}
            {...register('description')}
          />
          <ImageDragField placeholder="Favicon" types={['x-icon']} onChange={setIcon} url={url} />
          <Button onClick={handleSubmit(onSubmit)} aria-label="save" color="primary">
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};
