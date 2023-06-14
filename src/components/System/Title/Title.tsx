import Head from 'next/head';
import React, { FC, ReactNode, useMemo } from 'react';
import { useSystemQuery } from '@/generated/graphql';
import { hostUrl } from '@/libs/hostUrl';

interface Props {
  children?: ReactNode;
}

/**
 * Title
 *
 * @param {Props} { }
 */
export const Title: FC<Props> = ({ children }) => {
  const [{ data }] = useSystemQuery();
  const subTitle = useMemo(() => {
    return React.Children.map(children, (c) => (typeof c === 'object' ? '' : c))?.join('');
  }, [children]);
  if (!data) return null;
  const systemTitle = data.System.title;
  const systemDescription = data.System.description;
  const title = (subTitle || '') + ` | ${systemTitle}`;
  const imageUrl = `${hostUrl}/api/og?title=${encodeURI(subTitle || '')}&name=${encodeURI(
    systemTitle
  )}`;
  return (
    <Head>
      <title>{title}</title>
      <meta property="description" content={systemDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={systemDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content={'summary_large_image'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={systemDescription} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};
