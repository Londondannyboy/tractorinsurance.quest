import Link from 'next/link';
import { TOPIC_CLUSTERS, getClusterBySlug } from '@/data/topic-clusters';

interface RelatedArticle {
  href: string;
  title: string;
  description?: string;
  icon?: string;
}

interface RelatedArticlesProps {
  articles?: RelatedArticle[];
  // Or use automatic lookup from cluster
  cluster?: string;
  currentSlug?: string;
  limit?: number;
  title?: string;
}

export function RelatedArticles({
  articles,
  cluster,
  currentSlug,
  limit = 4,
  title = 'Related Articles',
}: RelatedArticlesProps) {
  // If articles not provided, auto-generate from cluster
  let displayArticles = articles;

  if (!displayArticles && cluster) {
    const clusterData = getClusterBySlug(cluster);
    if (clusterData) {
      const relatedPages = clusterData.supportingPages
        .filter(p => p.slug !== currentSlug)
        .slice(0, limit)
        .map(p => ({
          href: `/${cluster}/${p.slug}`,
          title: p.title,
          icon: clusterData.icon,
        }));

      // Add pillar page if not current
      if (clusterData.pillarPage.slug !== currentSlug) {
        relatedPages.unshift({
          href: `/${cluster}`,
          title: clusterData.pillarPage.title,
          icon: clusterData.icon,
        });
      }

      displayArticles = relatedPages.slice(0, limit);
    }
  }

  if (!displayArticles || displayArticles.length === 0) {
    return null;
  }

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {displayArticles.map((article, index) => (
          <Link key={index} href={article.href} className="block group">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/50 transition-all h-full">
              <div className="flex items-start gap-3">
                {article.icon && <span className="text-2xl">{article.icon}</span>}
                <div>
                  <h3 className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">{article.description}</p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RelatedArticles;
