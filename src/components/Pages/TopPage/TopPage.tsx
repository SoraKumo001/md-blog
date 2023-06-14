import React, { FC, useMemo } from 'react';
import { PostsQuery, usePostsQuery } from '@/generated/graphql';
import { useLoading } from '@/hooks/useLoading';
import styled from './TopPage.module.scss';
import { PostList } from '../../PostList';
import { Title } from '../../System/Title';

interface Props {}

/**
 * TopPage
 *
 * @param {Props} { }
 */
export const TopPage: FC<Props> = ({}) => {
  const [{ fetching, data }] = usePostsQuery();
  const posts = useMemo(() => {
    if (!data?.Posts) return undefined;
    return [...data.Posts].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [data?.Posts]);
  const categories = useMemo(() => {
    if (!data?.Posts) return undefined;
    const categoryPosts: { [key: string]: { name: string; posts: PostsQuery['Posts'] } } = {};
    data.Posts.forEach((post) => [
      post.categories.forEach((c) => {
        const value = categoryPosts[c.id] ?? (categoryPosts[c.id] = { name: c.name, posts: [] });
        value.posts.push(post);
      }),
    ]);
    return Object.entries(categoryPosts).sort(([, a], [, b]) => (a.name < b.name ? -1 : 1));
  }, [data?.Posts]);

  useLoading(fetching);

  if (!posts || !categories) return null;
  return (
    <>
      <Title>一覧</Title>
      <div className={styled.root}>
        <PostList id="news" title="新着順" posts={posts} limit={10} />
        {categories.map(([id, { name, posts }]) => (
          <PostList key={id} id={id} title={name} posts={posts} limit={10} />
        ))}
      </div>
    </>
  );
};
