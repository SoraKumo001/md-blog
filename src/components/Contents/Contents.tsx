import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useMemo } from 'react';
import { Button } from 'react-daisyui';
import { MdEditNote as EditIcon } from 'react-icons/md';
import { usePostQuery } from '@/generated/graphql';
import { useUser } from '@/hooks/useAuth';
import { useLoading } from '@/hooks/useLoading';
import { useMarkdown } from '@/hooks/useMarkdown';
import { DateString } from '@/libs/dateString';
import { getFirebaseUrl } from '@/libs/getFirebaseUrl';
import styled from './Contents.module.scss';
import { ContentMarkdown } from '../ContentMarkdown';
import { ContentTable } from '../ContentTable';
import { Title } from '../System/Title';

const context = { additionalTypenames: ['Category'] };

interface Props {
  id: string;
}

/**
 * Contents
 *
 * @param {Props} { }
 */
export const Contents: FC<Props> = ({ id }) => {
  const router = useRouter();
  const [{ data, fetching, error }] = usePostQuery({ variables: { postId: id }, context });
  useEffect(() => {
    if (error) router.replace('/404');
  }, [router, error]);
  const [children, vnode] = useMarkdown(data?.findUniquePost.content);
  const session = useUser();
  const categories = useMemo(() => {
    return [...(data?.findUniquePost.categories ?? [])].sort((a, b) => (a.name < b.name ? -1 : 1));
  }, [data]);
  useLoading(fetching);
  if (!data) return null;
  const image = getFirebaseUrl(data.findUniquePost.cardId);
  return (
    <>
      <head>
        <meta name="date" content={new Date(data.findUniquePost.updatedAt).toISOString()} />
      </head>
      <Title image={image}>{data.findUniquePost.title}</Title>
      <div className={styled.root}>
        {session && (
          <Button
            variant="outline"
            size="sm"
            className={styled.edit}
            onClick={() => {
              router.push(`/edit/${id}`);
            }}
          >
            <EditIcon size={24} />
          </Button>
        )}
        <h1 className={styled.title} id="header-top">
          {image ? (
            <Image className={styled.card} src={image} alt="Eye catch" width={80} height={80} />
          ) : (
            <div className={styled.cardText}>📖</div>
          )}
          {data.findUniquePost.title}
        </h1>
        <div className={styled.separator}>
          <ContentTable className={styled.table} title={data.findUniquePost.title} vnode={vnode} />
          <div className={styled.main}>
            <div className={styled.date}>
              <span className={styled.label}>publication: </span>
              <span className={styled.value}>{DateString(data.findUniquePost.publishedAt)}</span>
            </div>
            <div className={styled.date}>
              <span className={styled.label}>update:</span>
              <span className={styled.value}>{DateString(data.findUniquePost.updatedAt)}</span>
            </div>
            {categories.length > 0 && (
              <div className={styled.categories}>
                {categories.map(({ id, name }) => (
                  <Link className={styled.category} key={id} href={`/category/${id}`}>
                    {name}
                  </Link>
                ))}
              </div>
            )}
            <ContentMarkdown className={styled.content}>{children}</ContentMarkdown>
          </div>
        </div>
      </div>
    </>
  );
};
