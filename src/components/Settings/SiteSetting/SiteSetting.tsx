import { Button, Container, Stack, TextField } from '@mui/material';
import React, { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ImageDragField } from '@/components/Commons/ImageDragField';
import { useSystemQuery, useUpdateSystemMutation } from '@/generated/graphql';
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
  const [icon, setIcon] = useState<Blob | null | undefined>();
  const onSubmit: SubmitHandler<FormInput> = ({ title, description }) => {
    updateSystem({ title, description, icon });
  };
  useLoading([fetching, mutationFetching]);
  if (!data) return null;
  const url = getFirebaseUrl(data.System.icon?.id);
  return (
    <div className={styled.root}>
      <Container maxWidth="sm" sx={{ pt: 5 }}>
        <Stack spacing={3}>
          <h1>サイト情報</h1>
          <TextField label="タイトル" defaultValue={data.System.title} {...register('title')} />
          <TextField
            label="説明"
            defaultValue={data.System.description}
            {...register('description')}
          />
          <ImageDragField placeholder="Favicon" types={['x-icon']} onChange={setIcon} url={url} />
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit(onSubmit)}
            aria-label="save"
          >
            保存
          </Button>
        </Stack>
      </Container>
    </div>
  );
};
