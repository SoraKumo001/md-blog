import DeleteIcon from '@mui/icons-material/Delete';
import LessIcon from '@mui/icons-material/ExpandLess';
import ExpandIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import {
  TextField,
  Switch,
  Button,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useRouter } from 'next/router';
import React, { FC, useMemo, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { MessageDialog } from '@/components/Commons/Dialog/MessageDialog';
import { ImageDragField } from '@/components/Commons/ImageDragField';
import { PostQuery, useCategoriesQuery, useUpdatePostMutation } from '@/generated/graphql';
import { useLoading } from '@/hooks/useLoading';
import { classNames } from '@/libs/classNames';
import { getFirebaseUrl } from '@/libs/getFirebaseUrl';
import { convertWebp } from '@/libs/webp';
import styled from './ToolBar.module.scss';
import { FormInput } from '../Editor';

interface Props {
  post: PostQuery['findUniquePost'];
  control: Control<FormInput>;
  onCard: (card: Blob | null | undefined) => void;
}

/**
 * ToolBar
 *
 * @param {Props} { }
 */
export const ToolBar: FC<Props> = ({ post, control, onCard }) => {
  const router = useRouter();
  const [{ fetching: updateFetching }, updatePost] = useUpdatePostMutation();
  const [isDelete, setDelete] = useState(false);
  const [{ data, fetching }] = useCategoriesQuery();
  const categoryList = useMemo(() => {
    if (!data) return undefined;
    return [...data?.findManyCategory].sort((a, b) => (a.name < b.name ? -1 : 1));
  }, [data]);
  const [isExpand, setExpand] = useState(false);
  const url = getFirebaseUrl(post.cardId);
  useLoading([fetching, updateFetching]);
  if (!categoryList) return null;

  return (
    <div className={styled.root}>
      <div className={styled.row}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setExpand((v) => !v)}
          aria-label="expand"
        >
          {isExpand ? <LessIcon /> : <ExpandIcon />}
        </Button>
        <Button type="submit" variant="outlined" size="small" aria-label="save">
          <SaveIcon />
        </Button>
        <Switch
          id="published"
          key={String(post.published)}
          defaultChecked={post.published}
          {...control.register('published')}
        />
        <TextField
          className="min-w-[300px] flex-1"
          id="postTitle"
          size="small"
          defaultValue={post.title}
          label="Title"
          {...control.register('title')}
        />
        <Controller
          control={control}
          defaultValue={post.categories.map((v) => v.id) ?? []}
          name="categories"
          render={({ field: { onChange, ...field } }) => (
            <FormControl size="small">
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                className={styled.categories}
                multiple
                renderValue={(selected) =>
                  selected.map((id) => categoryList.find((c) => c.id === id)?.name).join(',')
                }
                {...field}
              >
                <div className="flex flex-col gap-1">
                  {categoryList.map(({ id, name }) => (
                    <MenuItem key={id} value={name}>
                      <label className="flex items-center">
                        <Checkbox
                          checked={field.value.find((n) => id === n) !== undefined}
                          onChange={(e) =>
                            onChange(
                              e.target.checked
                                ? [...field.value, e.target.value]
                                : field.value.filter((name) => name !== e.target.value)
                            )
                          }
                          value={id}
                        />
                        <ListItemText primary={name} />
                      </label>
                    </MenuItem>
                  ))}
                </div>
              </Select>
            </FormControl>
          )}
        ></Controller>
        <Controller
          control={control}
          name="publishedAt"
          defaultValue={new Date(post.publishedAt)}
          render={({ field: { onChange, ...field } }) => (
            <DateTimePicker
              format="yyyy/MM/dd HH:mm:ss"
              slotProps={{ textField: { size: 'small' } }}
              label="Publish"
              defaultValue={field.value}
              onChange={(date) => {
                date && onChange(date);
              }}
              {...field}
            />
          )}
        ></Controller>
        <DateTimePicker
          format="yyyy/MM/dd HH:mm:ss"
          slotProps={{ textField: { size: 'small' } }}
          label="Update"
          value={new Date(post.updatedAt)}
          readOnly={true}
        />
        <Button variant="outlined" size="small" color="warning" aria-label="delete">
          <DeleteIcon onClick={() => setDelete(true)} />
        </Button>
        <MessageDialog
          isOpen={isDelete}
          onResult={(result) => {
            // if (result)
            //   updatePost({ postId: post.id, isTrash: true }).then(() => {
            //     router.replace('/');
            //   });
            setDelete(false);
          }}
        >
          削除しますか?
        </MessageDialog>
      </div>
      <div className={classNames(styled.row, !isExpand && styled.invisible)}>
        <ImageDragField
          placeholder="Eye catch"
          onChange={(blob) => {
            if (blob) convertWebp(blob).then((b) => onCard(b && b.size < blob.size ? b : blob));
            else onCard(null);
          }}
          url={url}
        />
      </div>
    </div>
  );
};
