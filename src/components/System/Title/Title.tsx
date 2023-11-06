import React, { FC, ReactNode, useMemo } from 'react';
import { useSystemQuery } from '@/generated/graphql';
import { useSelector } from '@/libs/context';

interface Props {
  image?: string;
  children?: ReactNode;
}

/**
 * Title
 *
 * @param {Props} { }
 */
export const Title: FC<Props> = ({ image, children }) => {
  const [{ data }] = useSystemQuery();
  const host = useSelector((state: { host?: string }) => state.host);
  const subTitle = useMemo(() => {
    return React.Children.map(children, (c) => (typeof c === 'object' ? '' : c))?.join('');
  }, [children]);
  if (!data) return null;
  const systemTitle = data.findUniqueSystem.title;
  const systemDescription = data.findUniqueSystem.description;
  const title = (subTitle || '') + ` | ${systemTitle}`;
  const imageUrl = [
    `${host}/api/og?title=${encodeURI(subTitle || '')}`,
    `name=${encodeURI(systemTitle)}`,
    image ? `image=${encodeURI(image)}` : [],
  ]
    .flat()
    .join('&');
  return (
    <head>
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
    </head>
  );
};
