import React, { FC, useMemo } from 'react';
import { PostList } from '@/components/PostList';
import { Title } from '@/components/System/Title';
import {
  PostsQuery,
  useCategoriesQuery,
  useCategoryQuery,
  usePostsQuery,
} from '@/generated/graphql';
import { useLoading } from '@/hooks/useLoading';
import styled from './Categories.module.scss';

interface Props {
  id: string;
}

/**
 * Categories
 *
 * @param {Props} { }
 */
export const Categories: FC<Props> = ({ id }) => {
  const [{ fetching, data }] = usePostsQuery();
  const [{ fetching: fetchingCategory, data: category }] = useCategoryQuery({
    variables: { id: id ?? '' },
    pause: id === 'news',
  });
  const posts = useMemo(() => {
    if (!data?.Posts) return undefined;
    return [...data.Posts]
      .filter((post) => id === 'news' || post.categories.some((category) => category.id === id))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [id, data?.Posts]);
  useLoading([fetching, fetchingCategory]);
  if (!posts) return null;
  return (
    <>
      <Title>一覧</Title>
      <div className={styled.root}>
        <PostList title={id === 'news' ? '新着順' : category?.Category.name ?? ''} posts={posts} />
      </div>
    </>
  );
};
