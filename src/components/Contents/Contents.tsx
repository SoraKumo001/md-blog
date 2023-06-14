import EditIcon from '@mui/icons-material/EditNote';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { FC, useEffect, useMemo } from 'react';
import { usePostQuery } from '@/generated/graphql';
import { useLoading } from '@/hooks/useLoading';
import { useMarkdown } from '@/hooks/useMarkdown';
import styled from './Contents.module.scss';
import { ContentMarkdown } from '../ContentMarkdown';
import { ContentTable } from '../ContentTable';
import { Title } from '../System/Title';

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
  const [{ data, fetching, error }] = usePostQuery({ variables: { postId: id } });
  useEffect(() => {
    if (error) router.replace('/error/404');
  }, [router, error]);
  const [children, vnode] = useMarkdown(data?.Post.content);
  const session = useSession({ required: false });
  const categories = useMemo(() => {
    return [...(data?.Post.categories ?? [])].sort((a, b) => (a.name < b.name ? -1 : 1));
  }, [data]);
  useLoading(fetching);
  if (!data) return null;
  return (
    <>
      <Title>{data.Post.title}</Title>
      <div className={styled.root}>
        {session && (
          <Button
            className={styled.edit}
            variant="outlined"
            size="small"
            onClick={() => {
              router.push(`/edit/${id}`);
            }}
          >
            <EditIcon fontSize="small" />
          </Button>
        )}
        <h1 className={styled.title} id="header-top">
          {data.Post.title}
        </h1>
        <div className={styled.separator}>
          <ContentTable className={styled.table} title={data.Post.title} vnode={vnode} />
          <div>
            {categories.length > 0 && (
              <div className="m-4 flex flex-wrap gap-2">
                {categories.map(({ id, name }) => (
                  <Link
                    className="rounded bg-blue-500 px-4 py-2  text-white shadow hover:bg-blue-300"
                    key={id}
                    href={`/category/${id}`}
                  >
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
