import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { TOPIC_CLUSTERS, getClusterBySlug } from '@/data/topic-clusters';
import { ContentPageTemplate } from '@/components/content/ContentPageTemplate';
import { KeyTakeaways, Callout, FAQAccordion, ExternalLinkCard } from '@/components/mdx';

// Generate static params for all pages
export async function generateStaticParams() {
  const params: { cluster: string; page: string }[] = [];

  for (const cluster of TOPIC_CLUSTERS) {
    for (const page of cluster.supportingPages) {
      params.push({
        cluster: cluster.slug,
        page: page.slug,
      });
    }
  }

  return params;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string; page: string }>;
}): Promise<Metadata> {
  const { cluster: clusterSlug, page: pageSlug } = await params;
  const cluster = getClusterBySlug(clusterSlug);

  if (!cluster) {
    return { title: 'Not Found' };
  }

  const page = cluster.supportingPages.find((p) => p.slug === pageSlug);
  if (!page) {
    return { title: 'Not Found' };
  }

  return {
    title: page.title,
    description: `Learn about ${page.title.toLowerCase()} in our comprehensive guide. ${cluster.description}`,
    keywords: [page.targetKeyword, cluster.name, 'UK pension'],
    openGraph: {
      title: page.title,
      description: `Learn about ${page.title.toLowerCase()} in our comprehensive guide.`,
      type: 'article',
      url: `https://pension.quest/${clusterSlug}/${pageSlug}`,
    },
  };
}

// Supporting page component
export default async function SupportingPage({
  params,
}: {
  params: Promise<{ cluster: string; page: string }>;
}) {
  const { cluster: clusterSlug, page: pageSlug } = await params;
  const cluster = getClusterBySlug(clusterSlug);

  if (!cluster) {
    notFound();
  }

  const page = cluster.supportingPages.find((p) => p.slug === pageSlug);
  if (!page) {
    notFound();
  }

  // Check if this is a calculator page
  const isCalculator = page.slug.includes('calculator') || page.title.toLowerCase().includes('calculator');

  // Generate contextual FAQs
  const faqs = [
    {
      question: `What will I learn from this ${page.title} guide?`,
      answer: `This guide explains ${page.title.toLowerCase()} in detail, including key concepts, practical examples, and how it affects your pension planning.`,
    },
    {
      question: `How does this relate to ${cluster.name}?`,
      answer: `${page.title} is an important aspect of ${cluster.name.toLowerCase()}. Understanding this topic will help you make better pension decisions.`,
    },
    {
      question: 'Where can I get personalized advice?',
      answer: 'For advice tailored to your specific situation, we recommend consulting a financial adviser regulated by the Financial Conduct Authority (FCA).',
    },
  ];

  // Key takeaways
  const keyTakeaways = [
    `Understanding ${page.title.toLowerCase()} is important for your pension planning`,
    `This guide is part of our ${cluster.name} topic cluster`,
    `Use the AI assistant for specific questions about your situation`,
    `Consider seeking professional advice for major pension decisions`,
  ];

  // Official sources based on topic
  const officialSources = getOfficialSources(cluster.id, page.slug);

  return (
    <ContentPageTemplate
      title={page.title}
      description={`Complete guide to ${page.title.toLowerCase()}. Part of our ${cluster.name} resource.`}
      cluster={clusterSlug}
      slug={pageSlug}
      readingTime={6}
    >
      {/* Key Takeaways */}
      <KeyTakeaways items={keyTakeaways} />

      {/* Introduction */}
      <p>
        This guide covers <strong>{page.title}</strong> in detail. Whether you&apos;re just starting
        to learn about {cluster.name.toLowerCase()} or looking for specific information, this
        guide will help you understand the key concepts.
      </p>

      {isCalculator ? (
        <Callout type="tip" title="Interactive Calculator Coming Soon">
          We&apos;re developing an interactive calculator for this topic. In the meantime, you
          can ask our AI assistant for estimates or try the official government resources below.
        </Callout>
      ) : (
        <Callout type="info" title="Need Help Understanding?">
          Use the AI assistant on the right to ask questions about this topic. You can also
          use voice mode for a more conversational experience.
        </Callout>
      )}

      {/* Main content section */}
      <h2>Understanding {page.title}</h2>
      <p>
        {page.title} is an important aspect of {cluster.name.toLowerCase()} that affects
        many people in the UK. This section breaks down the key concepts you need to know.
      </p>

      <h3>Key Points</h3>
      <ul>
        <li>This topic relates to {cluster.name.toLowerCase()}</li>
        <li>Search volume: {page.volume.toLocaleString()} monthly searches</li>
        <li>Our comprehensive guide covers the essentials</li>
        <li>Ask our AI for personalized insights</li>
      </ul>

      {/* Official sources */}
      {officialSources.length > 0 && (
        <>
          <h2>Official Resources</h2>
          <p>
            For official information on this topic, refer to these trusted UK government
            and regulatory sources:
          </p>
          <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
            {officialSources.map((source, i) => (
              <ExternalLinkCard
                key={i}
                href={source.href}
                title={source.title}
                source={source.source}
                description={source.description}
                trusted={true}
              />
            ))}
          </div>
        </>
      )}

      {/* FAQ Section */}
      <FAQAccordion items={faqs} title="Common Questions" />

      {/* CTA to pillar page */}
      <Callout type="tip" title={`Learn More About ${cluster.name}`}>
        This page is part of our comprehensive {cluster.name} guide. Visit our{' '}
        <a href={`/${clusterSlug}`}>{cluster.name} pillar page</a> for an overview
        of all related topics and calculators.
      </Callout>

      {/* Disclaimer */}
      <Callout type="warning" title="Disclaimer">
        This information is for general guidance only. Pension rules can be complex and
        change over time. For advice specific to your situation, please consult a
        qualified financial adviser.
      </Callout>
    </ContentPageTemplate>
  );
}

// Helper function to get relevant official sources
function getOfficialSources(clusterId: string, _pageSlug: string) {
  const sources: { href: string; title: string; source: string; description: string }[] = [];

  // Common sources
  if (clusterId.includes('state-pension') || clusterId === 'retirement-age') {
    sources.push({
      href: 'https://www.gov.uk/state-pension',
      title: 'State Pension - GOV.UK',
      source: 'GOV.UK',
      description: 'Official government information on State Pension',
    });
    sources.push({
      href: 'https://www.gov.uk/check-state-pension',
      title: 'Check Your State Pension',
      source: 'GOV.UK',
      description: 'Check your State Pension forecast online',
    });
  }

  if (clusterId === 'nhs-pension') {
    sources.push({
      href: 'https://www.nhsbsa.nhs.uk/member-hub',
      title: 'NHS Pension Scheme',
      source: 'NHS BSA',
      description: 'Official NHS Business Services Authority pension portal',
    });
  }

  if (clusterId === 'teachers-pension') {
    sources.push({
      href: 'https://www.teacherspensions.co.uk',
      title: 'Teachers\' Pension Scheme',
      source: 'Teachers\' Pensions',
      description: 'Official Teachers\' Pension Scheme website',
    });
  }

  if (clusterId === 'civil-service-pension') {
    sources.push({
      href: 'https://www.civilservicepensionscheme.org.uk',
      title: 'Civil Service Pension Scheme',
      source: 'MyCSP',
      description: 'Official Civil Service Pension Scheme portal',
    });
  }

  // Always include MoneyHelper
  sources.push({
    href: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement',
    title: 'Pensions and Retirement',
    source: 'MoneyHelper',
    description: 'Free, impartial guidance on pensions',
  });

  return sources.slice(0, 4);
}
