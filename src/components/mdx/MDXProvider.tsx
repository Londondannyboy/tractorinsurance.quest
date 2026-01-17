'use client';

import { ReactNode } from 'react';

// Import all MDX components
import { Callout } from './Callout';
import { FAQAccordion } from './FAQAccordion';
import { KeyTakeaways } from './KeyTakeaways';
import { InternalLink, InternalLinkCard } from './InternalLink';
import { ExternalLink, ExternalLinkCard } from './ExternalLink';
import { RelatedArticles } from './RelatedArticles';
import { ComparisonTable } from './ComparisonTable';
import { DataTable, StatePensionRatesTable, ContributionRatesTable } from './DataTable';
import { BarChart, DonutChart, LineChart, StatCard, StatGrid } from './PensionChart';
import {
  ArticleSchema,
  BreadcrumbSchema,
  HowToSchema,
  Breadcrumb,
  FinancialCalculatorSchema,
} from './SEO';

// Component map for MDX content
export const mdxComponents = {
  // Basic components
  Callout,
  FAQAccordion,
  KeyTakeaways,
  RelatedArticles,
  ComparisonTable,

  // Link components
  InternalLink,
  InternalLinkCard,
  ExternalLink,
  ExternalLinkCard,

  // Data visualization
  DataTable,
  StatePensionRatesTable,
  ContributionRatesTable,
  BarChart,
  DonutChart,
  LineChart,
  StatCard,
  StatGrid,

  // SEO components
  ArticleSchema,
  BreadcrumbSchema,
  HowToSchema,
  Breadcrumb,
  FinancialCalculatorSchema,

  // Custom wrappers for standard HTML elements with prose styling
  h1: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 mt-0 leading-tight tracking-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }: { children: ReactNode; id?: string; [key: string]: unknown }) => (
    <h2 id={id} className="text-2xl md:text-3xl font-bold text-white mb-4 mt-12 first:mt-0 leading-snug scroll-mt-20" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 mt-8 leading-snug" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <h4 className="text-lg font-semibold text-white mb-2 mt-6" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <p className="mb-6 text-slate-300" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <ol className="list-decimal pl-6 mb-6 space-y-2 text-slate-300" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <li className="text-slate-300 marker:text-emerald-400" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <blockquote className="border-l-4 border-emerald-500/50 bg-slate-800/30 pl-6 py-4 my-6 rounded-r-xl italic text-slate-300" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }: { children: ReactNode; className?: string; [key: string]: unknown }) => {
    // Check if this is inside a pre (code block) or inline
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={`text-slate-200 ${className || ''}`} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <pre className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 overflow-x-auto my-6" {...props}>
      {children}
    </pre>
  ),
  hr: () => <hr className="border-t border-slate-700/50 my-12" />,
  table: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-slate-700/50">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <thead className="bg-slate-800/80" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <th className="text-left p-4 font-semibold text-slate-300 border-b border-slate-700/50" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <td className="p-4 text-slate-300 border-b border-slate-700/30" {...props}>
      {children}
    </td>
  ),
  a: ({ children, href, ...props }: { children: ReactNode; href?: string; [key: string]: unknown }) => {
    // Check if external link
    const isExternal = href?.startsWith('http') || href?.startsWith('//');
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors inline-flex items-center gap-1"
          {...props}
        >
          {children}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      );
    }
    return (
      <a href={href} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors" {...props}>
        {children}
      </a>
    );
  },
  strong: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <strong className="font-semibold text-white" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <em className="italic text-slate-200" {...props}>
      {children}
    </em>
  ),
};

// MDX Provider wrapper component
interface MDXProviderProps {
  children: ReactNode;
}

export function MDXProvider({ children }: MDXProviderProps) {
  return (
    <div className="prose-pension">
      {children}
    </div>
  );
}

export default MDXProvider;
