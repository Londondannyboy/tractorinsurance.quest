'use client';

import { ReactNode, useCallback } from 'react';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { HumeWidget } from '@/components/HumeWidget';
import { Breadcrumb, ArticleSchema } from '@/components/mdx/SEO';
import { RelatedArticles } from '@/components/mdx/RelatedArticles';
import { TOPIC_CLUSTERS, getClusterBySlug } from '@/data/topic-clusters';
import { CopilotChartActions } from './CopilotChartActions';

interface ContentPageTemplateProps {
  // Page metadata
  title: string;
  description: string;
  cluster: string;
  slug: string;

  // Content
  children: ReactNode;

  // Optional overrides
  heroImage?: string;
  showVoice?: boolean;
  showRelated?: boolean;
  publishedDate?: string;
  modifiedDate?: string;
  readingTime?: number;
  tableOfContents?: { id: string; title: string; level: number }[];
}

export function ContentPageTemplate({
  title,
  description,
  cluster,
  slug,
  children,
  heroImage,
  showVoice = true,
  showRelated = true,
  publishedDate,
  modifiedDate,
  readingTime,
  tableOfContents,
}: ContentPageTemplateProps) {
  const clusterData = getClusterBySlug(cluster);

  // Make page context readable to CopilotKit
  useCopilotReadable({
    description: 'Current pension article page context',
    value: {
      page: 'article',
      title,
      description,
      cluster: cluster,
      clusterName: clusterData?.name || cluster,
      slug,
      topic: clusterData?.description || '',
    },
  });

  // Action: Explain term from this article
  useCopilotAction({
    name: "explain_term",
    description: "Explain a pension term or concept mentioned in the current article",
    parameters: [
      { name: "term", type: "string" as const, description: "The term to explain" },
    ],
    handler: async ({ term }) => {
      // Context-aware explanations based on the cluster
      const contextHint = clusterData?.name || 'general pension';
      return `In the context of ${contextHint}: "${term}" - Let me explain this concept and how it relates to the article you're reading.`;
    },
  });

  // Action: Show calculation/chart
  useCopilotAction({
    name: "show_chart",
    description: "Generate and display a chart or calculation relevant to the content",
    parameters: [
      { name: "chart_type", type: "string" as const, description: "Type of visualization: bar, donut, line, or stat" },
      { name: "title", type: "string" as const, description: "Chart title" },
      { name: "description", type: "string" as const, description: "What the chart shows" },
    ],
    render: ({ status, args }) => {
      if (status === 'inProgress') {
        return (
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
            <div className="h-32 bg-slate-700 rounded"></div>
          </div>
        );
      }

      // Return a placeholder that can be enhanced with actual chart data
      return (
        <div className="p-4 bg-slate-800/50 rounded-xl border border-emerald-500/30">
          <h4 className="text-emerald-400 font-medium mb-2">{args.title}</h4>
          <p className="text-slate-400 text-sm">{args.description}</p>
          <div className="mt-4 text-center text-slate-500 text-sm">
            [Chart visualization would appear here]
          </div>
        </div>
      );
    },
    handler: async ({ chart_type, title: chartTitle, description: chartDesc }) => {
      return `Generated ${chart_type} chart: ${chartTitle}. ${chartDesc}`;
    },
  });

  // Action: Navigate to related topic
  useCopilotAction({
    name: "navigate_to_related",
    description: "Suggest navigation to a related topic or guide",
    parameters: [
      { name: "query", type: "string" as const, description: "What the user wants to learn about" },
    ],
    handler: async ({ query }) => {
      // Find matching content
      const matches = TOPIC_CLUSTERS.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()) ||
        c.supportingPages.some(p => p.title.toLowerCase().includes(query.toLowerCase()))
      );

      if (matches.length > 0) {
        const suggestions = matches.slice(0, 3).map(c => `- ${c.name}: /${c.slug}`);
        return `Based on "${query}", here are relevant guides:\n${suggestions.join('\n')}\n\nWould you like me to explain any of these topics?`;
      }
      return `I couldn't find specific content about "${query}". Try asking me to explain it, or browse our topic clusters.`;
    },
  });

  // Quick question handler - opens copilot with the question
  const handleQuickQuestion = useCallback((question: string) => {
    // This will be handled by opening the CopilotSidebar
    // For now, we can use a custom event or state management
    console.log('Quick question:', question);
  }, []);

  // Build breadcrumbs
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    ...(clusterData ? [{ name: clusterData.name, href: `/${cluster}` }] : []),
    { name: title, href: `/${cluster}/${slug}` },
  ];

  // Suggested questions based on content
  const suggestedQuestions = [
    `What is ${clusterData?.name || 'this'}?`,
    'Show me a calculation',
    'Explain the key points',
    'What should I do next?',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Register CopilotKit chart actions */}
      <CopilotChartActions />

      {/* Schema markup */}
      <ArticleSchema
        title={title}
        description={description}
        url={`https://pension.quest/${cluster}/${slug}`}
        image={heroImage}
        publishedTime={publishedDate}
        modifiedTime={modifiedDate}
        section={clusterData?.name}
      />

      <CopilotSidebar
        defaultOpen={false}
        instructions={`You are an expert pension assistant helping users understand this article: "${title}".

ARTICLE CONTEXT:
- Topic: ${clusterData?.name || cluster}
- Description: ${description}

YOUR CAPABILITIES:
1. Explain any pension term or concept from this article
2. Show calculations and visualizations relevant to the topic
3. Navigate users to related guides and calculators
4. Answer questions about UK pension rules

KEY INFORMATION FOR THIS TOPIC:
${clusterData?.description || 'General UK pension information'}

RESPONSE GUIDELINES:
- Be helpful and accurate
- Use the available actions to show charts and explain terms
- Keep responses focused on the article topic
- If unsure, recommend consulting a financial adviser
- Keep responses concise but informative`}
        labels={{
          title: `${clusterData?.icon || '📖'} ${clusterData?.name || 'Pension'} Guide`,
          initial: `Welcome! I'm here to help you understand "${title}".\n\nI can:\n• Explain any pension terms\n• Show you calculations\n• Guide you to related topics\n\nWhat would you like to know?`,
        }}
        className="[&_.copilotKitSidebar]:bg-slate-900/95 [&_.copilotKitSidebar]:backdrop-blur-md [&_.copilotKitSidebar]:border-slate-700/50"
      >
        {/* Hero Banner */}
        <HeroBanner
          title={title}
          subtitle={clusterData?.name || cluster}
          description={description}
          unsplashQuery={clusterData?.unsplashQuery || 'retirement planning uk'}
          showVoiceWidget={showVoice}
          variant="article"
        />

        {/* Content Area */}
        <div className="container mx-auto px-4 py-12">
          <div className="content-with-sidebar">
            {/* Main Content */}
            <main className="content-main">
              {/* Breadcrumbs */}
              <Breadcrumb items={breadcrumbs} />

              {/* Article Meta */}
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

              {/* Table of Contents (if provided) */}
              {tableOfContents && tableOfContents.length > 0 && (
                <nav className="toc-container">
                  <h2>In This Guide</h2>
                  <ul>
                    {tableOfContents.map((item) => (
                      <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 1}rem` }}>
                        <a href={`#${item.id}`}>{item.title}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Main Content */}
              <article className="prose-pension">
                {children}
              </article>

              {/* Related Articles */}
              {showRelated && clusterData && (
                <RelatedArticles cluster={cluster} currentSlug={slug} limit={4} />
              )}
            </main>

            {/* Sidebar */}
            <aside className="content-sidebar">
              <div className="sidebar-sticky space-y-6">
                {/* Voice Widget */}
                {showVoice && (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                    <h3 className="text-white font-medium mb-3 text-sm">Ask by Voice</h3>
                    <HumeWidget />
                  </div>
                )}

                {/* Quick Questions */}
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                  <h3 className="text-white font-medium mb-3 text-sm">Quick Questions</h3>
                  <div className="space-y-2">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickQuestion(q)}
                        className="w-full text-left text-sm px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cluster Navigation */}
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
                      View all {clusterData.name} guides →
                    </a>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4">
                  <h4 className="text-amber-400 font-medium text-sm mb-2">Important</h4>
                  <p className="text-amber-200/70 text-xs leading-relaxed">
                    This is general information, not financial advice. Your pension decisions depend on your personal circumstances. Consider consulting a qualified financial adviser.
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

export default ContentPageTemplate;
