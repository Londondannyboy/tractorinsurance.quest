'use client';

import { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { HumeWidget } from '@/components/HumeWidget';
import { Breadcrumb, ArticleSchema } from '@/components/mdx/SEO';
import { RelatedArticles } from '@/components/mdx/RelatedArticles';
import { getClusterBySlug } from '@/data/topic-clusters';
import { CopilotChartActions } from './CopilotChartActions';

// Import all MDX components
import { Callout } from '@/components/mdx/Callout';
import { FAQAccordion } from '@/components/mdx/FAQAccordion';
import { KeyTakeaways } from '@/components/mdx/KeyTakeaways';
import { InternalLink, InternalLinkCard } from '@/components/mdx/InternalLink';
import { ExternalLink, ExternalLinkCard } from '@/components/mdx/ExternalLink';
import { ComparisonTable } from '@/components/mdx/ComparisonTable';
import { DataTable } from '@/components/mdx/DataTable';
import { BarChart, DonutChart, LineChart, StatCard, StatGrid } from '@/components/mdx/PensionChart';

// MDX component map
const mdxComponents = {
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
};

interface MDXArticlePageProps {
  title: string;
  description: string;
  cluster: string;
  slug: string;
  rawContent: string; // Raw MDX content instead of serialized
  readingTime?: number;
  publishedDate?: string;
  modifiedDate?: string;
}

export function MDXArticlePage({
  title,
  description,
  cluster,
  slug,
  rawContent,
  readingTime,
  publishedDate,
  modifiedDate,
}: MDXArticlePageProps) {
  const clusterData = getClusterBySlug(cluster);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Serialize MDX on client side
  useEffect(() => {
    async function processMDX() {
      try {
        const source = await serialize(rawContent, {
          parseFrontmatter: false,
        });
        setMdxSource(source);
      } catch (error) {
        console.error('Failed to serialize MDX:', error);
      } finally {
        setIsLoading(false);
      }
    }
    processMDX();
  }, [rawContent]);

  // Make page context readable to CopilotKit
  useCopilotReadable({
    description: 'Current pension article page context',
    value: {
      page: 'article',
      title,
      description,
      cluster,
      clusterName: clusterData?.name || cluster,
      slug,
    },
  });

  // Action: Explain term
  useCopilotAction({
    name: "explain_term",
    description: "Explain a pension term mentioned in the article",
    parameters: [
      { name: "term", type: "string" as const, description: "The term to explain" },
    ],
    handler: async ({ term }) => {
      return `Explaining "${term}" in context of ${clusterData?.name || 'pensions'}...`;
    },
  });

  // Build breadcrumbs
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    ...(clusterData ? [{ name: clusterData.name, href: `/${cluster}` }] : []),
    ...(slug ? [{ name: title, href: `/${cluster}/${slug}` }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <CopilotChartActions />

      <ArticleSchema
        title={title}
        description={description}
        url={`https://pension.quest/${cluster}${slug ? `/${slug}` : ''}`}
        publishedTime={publishedDate}
        modifiedTime={modifiedDate}
        section={clusterData?.name}
      />

      <CopilotSidebar
        defaultOpen={false}
        instructions={`You are helping with the article: "${title}". Topic: ${clusterData?.name || cluster}. Be helpful and accurate.`}
        labels={{
          title: `${clusterData?.icon || '📖'} ${clusterData?.name || 'Guide'}`,
          initial: `I can help you understand "${title}". Ask me anything!`,
        }}
        className="[&_.copilotKitSidebar]:bg-slate-900/95 [&_.copilotKitSidebar]:backdrop-blur-md"
      >
        <HeroBanner
          title={title}
          subtitle={clusterData?.name || cluster}
          description={description}
          unsplashQuery={clusterData?.unsplashQuery || 'retirement planning uk'}
          showVoiceWidget={true}
          variant="article"
        />

        <div className="container mx-auto px-4 py-12">
          <div className="content-with-sidebar">
            <main className="content-main">
              <Breadcrumb items={breadcrumbs} />

              {(readingTime || publishedDate) && (
                <div className="article-meta mb-8">
                  {readingTime && (
                    <span className="reading-time">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {readingTime} min read
                    </span>
                  )}
                  {publishedDate && (
                    <time dateTime={publishedDate}>
                      Updated: {new Date(publishedDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  )}
                </div>
              )}

              <article className="prose-pension">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-800 rounded w-4/5"></div>
                  </div>
                ) : mdxSource ? (
                  <MDXRemote {...mdxSource} components={mdxComponents} />
                ) : (
                  <p className="text-red-400">Failed to load content</p>
                )}
              </article>

              {clusterData && (
                <RelatedArticles cluster={cluster} currentSlug={slug} limit={4} />
              )}
            </main>

            <aside className="content-sidebar">
              <div className="sidebar-sticky space-y-6">
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                  <h3 className="text-white font-medium mb-3 text-sm">Ask by Voice</h3>
                  <HumeWidget />
                </div>

                {clusterData && (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                    <h3 className="text-white font-medium mb-3 text-sm flex items-center gap-2">
                      <span>{clusterData.icon}</span>
                      More on {clusterData.name}
                    </h3>
                    <ul className="space-y-1">
                      {clusterData.supportingPages.slice(0, 5).map((page) => (
                        <li key={page.slug}>
                          <a
                            href={`/${cluster}/${page.slug}`}
                            className={`block text-sm px-2 py-1.5 rounded ${
                              page.slug === slug
                                ? 'bg-emerald-900/30 text-emerald-400'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                            } transition-colors`}
                          >
                            {page.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`/${cluster}`}
                      className="block text-sm text-emerald-400 hover:text-emerald-300 mt-3 pt-3 border-t border-slate-700/50"
                    >
                      View all guides →
                    </a>
                  </div>
                )}

                <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4">
                  <h4 className="text-amber-400 font-medium text-sm mb-2">Important</h4>
                  <p className="text-amber-200/70 text-xs leading-relaxed">
                    This is general information, not financial advice. Consider consulting a qualified financial adviser.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </CopilotSidebar>
    </div>
  );
}

export default MDXArticlePage;
