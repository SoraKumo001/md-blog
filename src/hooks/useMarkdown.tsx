/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React, { ElementType, Fragment, HTMLProps, useMemo } from 'react';
import { PrismAsync } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { LinkTarget } from '@/components/Commons/LinkTarget';
import { MarkdownComponents, createProcessor } from '@/libs/MarkdownCompiler';

const components: MarkdownComponents = {
  heading: ({ node, children, property, props }) => {
    const Tag: ElementType = ('h' + (node.depth + 1)) as 'h1';
    const index = (property as { headerCount?: number }).headerCount ?? 0;
    property.headerCount = index + 1;
    return (
      <Fragment {...props}>
        <LinkTarget id={`header-${index}`} />
        <Tag>{children}</Tag>
      </Fragment>
    );
  },
  link({ node, children, props }) {
    const href = node.url;
    if (href?.match(/^https:\/\/codepen.io\//)) {
      return (
        <iframe
          loading="lazy"
          allowFullScreen={true}
          allowTransparency={true}
          src={href.replace('/pen/', '/embed/')}
        />
      );
    }
    return (
      <Link {...props} href={href ?? ''} target={href?.match(/https?:/) ? '_blank' : undefined}>
        {children}
      </Link>
    );
  },
  image({ node, props }) {
    const alt = node.alt;
    const src = node.url.match(/https?:/)
      ? node.url
      : `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GOOGLE_STRAGE_BUCKET}/${node.url}`;

    try {
      const styleString = alt?.match(/^{.*}$/);
      const style = styleString ? JSON.parse(alt ?? '') : {};
      return (
        <img
          key={props.key}
          src={src}
          width={style.width && parseInt(style.width)}
          height={style.height && parseInt(style.height)}
          alt={alt ?? undefined}
        />
      );
    } catch {}
    return <img {...props} src={src} alt="" />;
  },
  code({ node, children, props }) {
    const pos = node.position;
    return (
      <div {...props} className="overflow-hidden">
        <PrismAsync
          language={node.lang ?? 'txt'}
          style={{ ...darcula }}
          showLineNumbers={true}
          wrapLines={true}
          PreTag="div"
          lineProps={(number) =>
            ({
              'data-sourcepos': number + (pos?.start.line ?? 0),
            } as HTMLProps<HTMLElement>)
          }
        >
          {String(children).replace(/\n$/, '')}
        </PrismAsync>
      </div>
    );
  },
};

export const useMarkdown = (value?: string) => {
  const processor = useMemo(() => createProcessor(components as never), []);
  return useMemo(() => {
    if (value === undefined) return [];
    return processor.processSync(value).result;
  }, [processor, value]);
};
