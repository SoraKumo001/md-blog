import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useMemo } from 'react';
import { PostsQuery } from '@/generated/graphql';
import { classNames } from '@/libs/classNames';
import { DateString } from '@/libs/dateString';
import { getFirebaseUrl } from '@/libs/getFirebaseUrl';
import styled from './PostList.module.scss';

interface Props {
  id?: string;
  title: string;
  posts: PostsQuery['findManyPost'];
  limit?: number;
}

/**
 * PostList
 *
 * @param {Props} { }
 */
export const PostList: FC<Props> = ({ id, title, posts, limit }) => {
  const list = useMemo(() => {
    return posts.slice(0, limit ?? Number.MAX_VALUE);
  }, [limit, posts]);
  return (
    <div className={styled.root}>
      <div className={styled.title}>
        <Link href={`/category/${id ?? ''}`}>📚 {title}</Link>
      </div>
      <div className={styled.postList}>
        {list?.map((post) => (
          <Link
            key={post.id}
            className={classNames(styled.post, !post.published && styled.unPublish)}
            href={`/contents/${post.id}`}
          >
            <div className={styled.image}>
              {post.cardId ? (
                <Image
                  className={styled.card}
                  src={getFirebaseUrl(post.cardId)}
                  alt="Eye catch"
                  loading="lazy"
                  width={80}
                  height={80}
                  unoptimized={true}
                />
              ) : (
                `📖`
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-hidden">
              <div className={styled.postTitle}>{post.title}</div>
              <div className={styled.date}>
                <div>公開:{DateString(post.publishedAt)}</div>
                <div>更新:{DateString(post.updatedAt)}</div>
              </div>
            </div>
          </Link>
        ))}
        {list.length % 2 ? <div className={styled.post} style={{ visibility: 'hidden' }} /> : null}
      </div>
      {limit && posts.length > limit && (
        <div className={styled.more}>
          <Link href={`/category/${id ?? ''}`}>more…</Link>
        </div>
      )}
    </div>
  );
};
