import { dynamicImport } from '@node-libraries/dynamic-import';
import type { Root } from 'mdast';

export const getImages = async (content: string) => {
  const isNextJS = process.env.NEXT_RUNTIME;
  const { remark } = !isNextJS
    ? await dynamicImport<typeof import('remark')>('remark')
    : await import('remark');
  const processor = remark();
  const tree = processor().parse(content);

  const grep = /^https?:\/\//i;
  const getImage = (nodes: Root['children']): string[] => {
    return nodes.flatMap((node) => {
      return 'children' in node
        ? getImage(node.children)
        : node.type === 'image' && node.url && !grep.test(node.url)
        ? node.url
        : [];
    });
  };

  return Array.from(new Set(getImage(tree.children)));
};
