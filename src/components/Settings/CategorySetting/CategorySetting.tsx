import { Button, Stack, TextField } from '@mui/material';
import React, { FC, Fragment, useEffect } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useCategoriesQuery, useUpdateCategoryMutation } from '@/generated/graphql';
import { useLoading } from '@/hooks/useLoading';

type FormInput = {
  categories: { id: string; name: string }[];
};

interface Props {}

/**
 * CategorySetting
 *
 * @param {Props} { }
 */
export const CategorySetting: FC<Props> = ({}) => {
  const { register, handleSubmit, watch, control } = useForm<FormInput>({
    defaultValues: { categories: [] },
  });
  const { fields, remove, append } = useFieldArray({ control, name: 'categories' });
  const [{ fetching: mutationFetching }, updateCategory] = useUpdateCategoryMutation();
  const [{ data, fetching }] = useCategoriesQuery();
  const onSubmit: SubmitHandler<FormInput> = async ({ categories }) => {
    await Promise.all(
      categories.map(async ({ id, name }) => {
        if (id && name) {
          await updateCategory({ id, name });
        } else if (name) {
          await updateCategory({ name });
        }
      })
    );
  };
  useLoading([fetching, mutationFetching]);

  watch(({ categories }) => {
    if (categories?.[categories.length - 1]?.name) {
      append({ id: '', name: '' });
    }
  });
  useEffect(() => {
    if (data) {
      remove();
      [...data.Categories]
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .forEach(({ id, name }) => append({ id, name }));
      append({ id: '', name: '' });
    }
  }, [data, append, remove]);

  return (
    <Stack spacing={3}>
      <h2>カテゴリ</h2>
      {fields.map(({ id, name }, index) => (
        <Fragment key={id}>
          <input type="hidden" {...register(`categories.${index}.id`)} />
          <TextField
            key={id}
            label={`Category ${index + 1}`}
            defaultValue={name}
            {...register(`categories.${index}.name`)}
          />
        </Fragment>
      ))}
      <Button variant="contained" size="large" onClick={handleSubmit(onSubmit)}>
        保存
      </Button>
    </Stack>
  );
};
