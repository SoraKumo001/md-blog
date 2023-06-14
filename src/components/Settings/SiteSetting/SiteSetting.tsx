import { Button, Stack, TextField } from '@mui/material';
import React, { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSystemQuery, useUpdateSystemMutation } from '@/generated/graphql';
import { useLoading } from '@/hooks/useLoading';

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
  const onSubmit: SubmitHandler<FormInput> = ({ title, description }) => {
    updateSystem({ title, description });
  };
  useLoading([fetching, mutationFetching]);
  if (!data) return null;
  return (
    <Stack spacing={3}>
      <h2>サイト情報</h2>
      <TextField label="タイトル" defaultValue={data.System.title} {...register('title')} />
      <TextField label="説明" defaultValue={data.System.description} {...register('description')} />
      <Button variant="contained" size="large" onClick={handleSubmit(onSubmit)}>
        保存
      </Button>
    </Stack>
  );
};
