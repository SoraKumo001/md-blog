import { dynamicImport } from '@node-libraries/dynamic-import';
import type { Root } from 'mdast';
import type { Processor, Compiler } from 'unified';

export const getImages = async (content: string) => {
  function getImagesCompiler(this: Processor) {
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
    const Compiler: Compiler<Root, string[]> = (tree) => {
      return Array.from(new Set(getImage(tree.children)));
    };
    this.Compiler = Compiler;
  }
  const isNextJS = process.env.NEXT_RUNTIME;
  const { unified } = !isNextJS
    ? await dynamicImport<typeof import('unified')>('unified')
    : await import('unified');
  const remarkParse = !isNextJS
    ? (await dynamicImport<typeof import('remark-parse')>('remark-parse')).default
    : (await import('remark-parse')).default;
  const processor = unified().use(remarkParse).use(getImagesCompiler) as Processor<
    Root,
    Root,
    Root,
    string[]
  >;
  return processor().process(content);
};
