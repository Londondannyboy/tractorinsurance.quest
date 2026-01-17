'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { mdxComponents } from '@/components/mdx/MDXProvider';

interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
}

export function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div className="prose-pension">
      <MDXRemote {...source} components={mdxComponents} />
    </div>
  );
}

export default MDXRenderer;
