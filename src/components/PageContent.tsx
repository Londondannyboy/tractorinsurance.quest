'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CallToAction,
  InlineCTA,
  FeatureBox,
  FeatureGrid,
} from '@/components/mdx';

// Simple MDX-like renderer that handles our custom components
function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeader: string[] = [];

  const processInlineMarkdown = (text: string): React.ReactNode => {
    // Handle bold
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="text-white">{part.slice(2, -2)}</strong>;
      }
      // Handle links
      const linkParts = part.split(/(\[[^\]]+\]\([^)]+\))/g);
      return linkParts.map((lp, lidx) => {
        const linkMatch = lp.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const isExternal = linkMatch[2].startsWith('http');
          if (isExternal) {
            return <a key={`${idx}-${lidx}`} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">{linkMatch[1]}</a>;
          }
          return <Link key={`${idx}-${lidx}`} href={linkMatch[2]} className="text-amber-400 hover:underline">{linkMatch[1]}</Link>;
        }
        return lp;
      });
    });
  };

  const flushTable = () => {
    if (tableHeader.length > 0 || tableRows.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm">
            {tableHeader.length > 0 && (
              <thead>
                <tr className="border-b border-stone-700">
                  {tableHeader.map((h, hi) => (
                    <th key={hi} className="text-left py-3 px-4 text-white font-semibold">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri} className="border-b border-stone-800">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-3 px-4 text-white/70">
                      {cell.trim() === '✓' ? <span className="text-emerald-400">&#10003;</span> :
                       cell.trim() === '✗' ? <span className="text-red-400">&#10007;</span> :
                       cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeader = [];
      tableRows = [];
      inTable = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Handle table rows
    if (line.trim().startsWith('|')) {
      if (!inTable) {
        inTable = true;
        const cells = line.split('|').filter(c => c.trim() !== '');
        tableHeader = cells;
        i++;
        // Skip separator line
        if (i < lines.length && lines[i].trim().match(/^\|[-:|]+\|$/)) {
          i++;
        }
        continue;
      } else {
        const cells = line.split('|').filter(c => c.trim() !== '');
        tableRows.push(cells);
        i++;
        continue;
      }
    } else if (inTable) {
      flushTable();
    }

    // Handle custom components
    if (line.trim().startsWith('<CallToAction')) {
      const titleMatch = line.match(/title="([^"]+)"/);
      const descMatch = line.match(/description="([^"]+)"/);
      const btnMatch = line.match(/buttonText="([^"]+)"/);
      const variantMatch = line.match(/variant="([^"]+)"/);
      elements.push(
        <div key={`cta-${i}`} className="my-8">
          <CallToAction
            title={titleMatch?.[1] || ''}
            description={descMatch?.[1] || ''}
            buttonText={btnMatch?.[1] || 'Get Quote'}
            variant={variantMatch?.[1] as 'primary' | 'secondary' || 'primary'}
          />
        </div>
      );
      i++;
      continue;
    }

    if (line.trim() === '<FeatureGrid>') {
      // Collect FeatureBox components until </FeatureGrid>
      const features: { title: string; description: string; icon: string }[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('</FeatureGrid>')) {
        const featureLine = lines[i].trim();
        if (featureLine.startsWith('<FeatureBox')) {
          const fTitle = featureLine.match(/title="([^"]+)"/)?.[1] || '';
          const fDesc = featureLine.match(/description="([^"]+)"/)?.[1] || '';
          const fIcon = featureLine.match(/icon="([^"]+)"/)?.[1] || '';
          features.push({ title: fTitle, description: fDesc, icon: fIcon });
        }
        i++;
      }
      elements.push(
        <div key={`fg-${i}`} className="my-8">
          <FeatureGrid>
            {features.map((f, fi) => (
              <FeatureBox key={fi} title={f.title} description={f.description} />
            ))}
          </FeatureGrid>
        </div>
      );
      i++;
      continue;
    }

    // Skip other component lines
    if (line.trim().startsWith('<') && !line.trim().startsWith('<a') && !line.trim().startsWith('<strong')) {
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      flushTable();
      elements.push(
        <h1 key={`h1-${i}`} className="text-3xl md:text-4xl font-bold text-white mb-6 mt-12 first:mt-0">
          {processInlineMarkdown(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      flushTable();
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl md:text-3xl font-bold text-white mb-4 mt-10">
          {processInlineMarkdown(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      flushTable();
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl font-bold text-white mb-3 mt-8">
          {processInlineMarkdown(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // List items
    if (line.trim().startsWith('- ')) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        listItems.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 my-4 ml-4">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-3 text-white/70">
              <span className="text-amber-400 mt-1">&#8226;</span>
              <span>{processInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list items
    if (line.trim().match(/^\d+\.\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 my-4 ml-4">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-3 text-white/70">
              <span className="text-amber-400 font-bold mt-0.5">{li + 1}.</span>
              <span>{processInlineMarkdown(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Regular paragraphs
    flushTable();
    elements.push(
      <p key={`p-${i}`} className="text-white/70 leading-relaxed mb-4">
        {processInlineMarkdown(line)}
      </p>
    );
    i++;
  }

  // Flush any remaining table
  flushTable();

  return elements;
}

interface PageContentProps {
  slug: string;
}

export function PageContent({ slug }: PageContentProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`/api/content?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
        } else {
          setError('Content not found');
        }
      } catch (err) {
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="text-center py-20">
        <p className="text-white/60">{error || 'Content unavailable'}</p>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="prose prose-invert max-w-none"
    >
      {renderContent(content)}
    </motion.article>
  );
}
