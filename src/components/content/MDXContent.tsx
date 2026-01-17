'use client';

import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Import all MDX components
import { Callout } from '@/components/mdx/Callout';
import { FAQAccordion } from '@/components/mdx/FAQAccordion';
import { KeyTakeaways } from '@/components/mdx/KeyTakeaways';
import { InternalLink, InternalLinkCard } from '@/components/mdx/InternalLink';
import { ExternalLink, ExternalLinkCard } from '@/components/mdx/ExternalLink';
import { RelatedArticles } from '@/components/mdx/RelatedArticles';
import { ComparisonTable } from '@/components/mdx/ComparisonTable';
import { DataTable } from '@/components/mdx/DataTable';
import { BarChart, DonutChart, LineChart, StatCard, StatGrid } from '@/components/mdx/PensionChart';

// Component map for MDX
const components = {
  // Custom components
  Callout,
  FAQAccordion,
  KeyTakeaways,
  InternalLink,
  InternalLinkCard,
  ExternalLink,
  ExternalLinkCard,
  RelatedArticles,
  ComparisonTable,
  DataTable,
  BarChart,
  DonutChart,
  LineChart,
  StatCard,
  StatGrid,

  // Wrapper for code to prevent nesting issues
  wrapper: ({ children }: { children: React.ReactNode }) => (
    <div className="prose-pension">{children}</div>
  ),
};

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

export function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote {...source} components={components} />;
}

export default MDXContent;
