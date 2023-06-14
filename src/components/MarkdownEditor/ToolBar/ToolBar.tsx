import DeleteIcon from '@mui/icons-material/Delete';
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
import { MessageDialog } from '@/components/Commons/Dialog/MessageDialog';
import { PostQuery, useCategoriesQuery, useUpdatePostMutation } from '@/generated/graphql';
import { useLoading } from '@/hooks/useLoading';
import styled from './ToolBar.module.scss';

interface Props {
  post: PostQuery['Post'];
}

/**
 * ToolBar
 *
 * @param {Props} { }
 */
export const ToolBar: FC<Props> = ({ post }) => {
  const router = useRouter();
  const [{ fetching: updateFetching }, updatePost] = useUpdatePostMutation();
  const [isDelete, setDelete] = useState(false);
  const [categories, setCategories] = useState<string[]>(post.categories.map(({ id }) => id));
  const [{ data, fetching }] = useCategoriesQuery();
  useLoading([fetching, updateFetching]);
  const categoryList = useMemo(() => {
    if (!data) return undefined;
    return [...data?.Categories].sort((a, b) => (a.name < b.name ? -1 : 1));
  }, [data]);
  if (!categoryList) return null;

  return (
    <div className={styled.root}>
      <Button type="submit" variant="outlined" size="small">
        <SaveIcon />
      </Button>
      <Switch id="published" key={String(post.published)} defaultChecked={post.published} />
      <TextField
        className="min-w-[300px] flex-1"
        id="postTitle"
        size="small"
        defaultValue={post.title}
        label="Title"
      />
      <FormControl size="small">
        <InputLabel>Category</InputLabel>
        <Select
          label="Category"
          name="categories"
          className={styled.categories}
          multiple
          value={categories}
          renderValue={(selected) =>
            selected.map((id) => categoryList.find((c) => c.id === id)?.name).join(',')
          }
        >
          <div className="flex flex-col gap-1">
            {categoryList.map(({ id, name }) => (
              <MenuItem key={id} value={name}>
                <label className="flex items-center">
                  <Checkbox
                    checked={categories.find((n) => id === n) !== undefined}
                    onChange={(e) =>
                      setCategories((v) =>
                        e.target.checked
                          ? [...v, e.target.value]
                          : v.filter((name) => name !== e.target.value)
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

      <DateTimePicker
        format="yyyy/MM/dd HH:mm:ss"
        slotProps={{ textField: { id: 'publishedDate', size: 'small' } }}
        label="Publish"
        value={new Date(post.publishedAt)}
      />
      <DateTimePicker
        format="yyyy/MM/dd HH:mm:ss"
        slotProps={{ textField: { size: 'small' } }}
        label="Update"
        value={new Date(post.updatedAt)}
        readOnly={true}
      />
      <Button variant="outlined" size="small" color="warning">
        <DeleteIcon onClick={() => setDelete(true)} />
      </Button>
      <MessageDialog
        isOpen={isDelete}
        onResult={(result) => {
          if (result)
            updatePost({ postId: post.id, isTrash: true }).then(() => {
              router.replace('/');
            });
          setDelete(false);
        }}
      >
        削除しますか?
      </MessageDialog>
    </div>
  );
};
