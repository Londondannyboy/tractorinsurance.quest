import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { TOPIC_CLUSTERS, getClusterBySlug } from '@/data/topic-clusters';
import { ContentPageTemplate } from '@/components/content/ContentPageTemplate';
import { MDXArticlePage } from '@/components/content/MDXArticlePage';
import { getContent, contentExists } from '@/lib/mdx';
import { KeyTakeaways, Callout, InternalLinkCard, FAQAccordion } from '@/components/mdx';

// Generate static params for all clusters
export async function generateStaticParams() {
  return TOPIC_CLUSTERS.map((cluster) => ({
    cluster: cluster.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string }>;
}): Promise<Metadata> {
  const { cluster: clusterSlug } = await params;

  // Check for MDX content first
  const mdxContent = getContent(clusterSlug);
  if (mdxContent) {
    return {
      title: mdxContent.frontmatter.title,
      description: mdxContent.frontmatter.description,
      keywords: mdxContent.frontmatter.keywords,
      openGraph: {
        title: mdxContent.frontmatter.title,
        description: mdxContent.frontmatter.description,
        type: 'article',
        url: `https://pension.quest/${clusterSlug}`,
      },
    };
  }

  // Fall back to cluster data
  const cluster = getClusterBySlug(clusterSlug);
  if (!cluster) {
    return { title: 'Not Found' };
  }

  return {
    title: cluster.pillarPage.title,
    description: cluster.description,
    keywords: [cluster.pillarPage.targetKeyword, cluster.name, 'UK pension'],
    openGraph: {
      title: cluster.pillarPage.title,
      description: cluster.description,
      type: 'article',
      url: `https://pension.quest/${clusterSlug}`,
    },
  };
}

// Pillar page component
export default async function ClusterPillarPage({
  params,
}: {
  params: Promise<{ cluster: string }>;
}) {
  const { cluster: clusterSlug } = await params;
  const cluster = getClusterBySlug(clusterSlug);

  if (!cluster) {
    notFound();
  }

  // Check for MDX content
  if (contentExists(clusterSlug)) {
    const mdxContent = getContent(clusterSlug);
    if (!mdxContent) {
      notFound();
    }

    return (
      <MDXArticlePage
        title={mdxContent.frontmatter.title}
        description={mdxContent.frontmatter.description}
        cluster={clusterSlug}
        slug=""
        rawContent={mdxContent.content}
        readingTime={mdxContent.frontmatter.readingTime}
        publishedDate={mdxContent.frontmatter.publishedDate}
        modifiedDate={mdxContent.frontmatter.modifiedDate}
      />
    );
  }

  // Fall back to placeholder content
  const faqs = [
    {
      question: `What is ${cluster.name}?`,
      answer: cluster.description,
    },
    {
      question: `How do I find out more about ${cluster.name}?`,
      answer: `Browse our ${cluster.supportingPages.length} detailed guides below, or use the AI assistant to ask specific questions.`,
    },
  ];

  const keyTakeaways = [
    `${cluster.name} is a key part of UK pension planning`,
    `We have ${cluster.supportingPages.length} detailed guides on this topic`,
    'Use our calculators to estimate your specific situation',
    'Consider consulting a financial adviser for personalized advice',
  ];

  return (
    <ContentPageTemplate
      title={cluster.pillarPage.title}
      description={cluster.description}
      cluster={clusterSlug}
      slug={cluster.pillarPage.slug}
      readingTime={8}
    >
      <KeyTakeaways items={keyTakeaways} />

      <p>
        Welcome to our comprehensive guide on <strong>{cluster.name}</strong>. This pillar page
        covers everything you need to know, with links to detailed guides on specific topics.
      </p>

      <Callout type="info" title="Why This Matters">
        Understanding {cluster.name.toLowerCase()} is essential for planning your retirement
        and making informed decisions about your pension.
      </Callout>

      <h2>Detailed Guides</h2>
      <p>
        Explore our in-depth guides on specific {cluster.name.toLowerCase()} topics:
      </p>

      <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
        {cluster.supportingPages.map((page) => (
          <InternalLinkCard
            key={page.slug}
            href={`/${clusterSlug}/${page.slug}`}
            title={page.title}
            icon={cluster.icon}
            category={cluster.name}
          />
        ))}
      </div>

      {cluster.relatedClusters.length > 0 && (
        <>
          <h2>Related Topics</h2>
          <p>
            You might also be interested in these related pension topics:
          </p>
          <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
            {cluster.relatedClusters.slice(0, 4).map((relatedId) => {
              const related = TOPIC_CLUSTERS.find((c) => c.id === relatedId);
              if (!related) return null;
              return (
                <InternalLinkCard
                  key={related.id}
                  href={`/${related.slug}`}
                  title={related.pillarPage.title}
                  description={related.description}
                  icon={related.icon}
                  category={related.name}
                />
              );
            })}
          </div>
        </>
      )}

      <FAQAccordion items={faqs} title="Frequently Asked Questions" />

      <Callout type="warning" title="Important Disclaimer">
        The information on this page is for general guidance only and should not be considered
        financial advice. Pension decisions depend on your individual circumstances. We recommend
        consulting a qualified financial adviser regulated by the FCA.
      </Callout>
    </ContentPageTemplate>
  );
}
