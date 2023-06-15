import EditIcon from '@mui/icons-material/EditNote';
import { Button } from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo } from 'react';
import { usePostQuery } from '@/generated/graphql';
import { useLoading } from '@/hooks/useLoading';
import { useMarkdown } from '@/hooks/useMarkdown';
import { useSelector } from '@/libs/context';
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
    if (error) router.replace('/error/404');
  }, [router, error]);
  const [children, vnode] = useMarkdown(data?.Post.content);
  const session = useSelector(
    (state: { session: { email: string; name: string } }) => state.session
  );
  const categories = useMemo(() => {
    return [...(data?.Post.categories ?? [])].sort((a, b) => (a.name < b.name ? -1 : 1));
  }, [data]);
  useLoading(fetching);
  if (!data) return null;
  const image = getFirebaseUrl(data.Post.cardId);
  return (
    <>
      <Head>
        <meta name="date" content={new Date(data.Post.updatedAt).toISOString()} />
      </Head>
      <Title image={image}>{data.Post.title}</Title>
      <div className={styled.root}>
        {session && (
          <Button
            className={styled.edit}
            variant="outlined"
            size="small"
            onClick={() => {
              router.push(`/edit/${id}`);
            }}
            aria-label="edit"
          >
            <EditIcon fontSize="small" />
          </Button>
        )}
        <h1 className={styled.title} id="header-top">
          {image ? (
            <Image
              className={styled.card}
              src={image}
              alt="Eye catch"
              width={80}
              height={80}
              unoptimized
            />
          ) : (
            <div className={styled.cardText}>📖</div>
          )}
          {data.Post.title}
        </h1>
        <div className={styled.separator}>
          <ContentTable className={styled.table} title={data.Post.title} vnode={vnode} />
          <div className={styled.main}>
            <div className={styled.date}>
              <span className={styled.label}>publication: </span>
              <span className={styled.value}>{DateString(data.Post.publishedAt)}</span>
            </div>
            <div className={styled.date}>
              <span className={styled.label}>update:</span>
              <span className={styled.value}>{DateString(data.Post.updatedAt)}</span>
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
