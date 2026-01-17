import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content');

export interface ContentFrontmatter {
  title: string;
  description: string;
  keywords: string[];
  targetKeyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  cluster: string;
  pillar?: boolean;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  readingTime?: number;
  unsplashQuery?: string;
  heroImage?: string | null;
}

export interface ContentFile {
  slug: string;
  frontmatter: ContentFrontmatter;
  content: string;
}

/**
 * Get all content files for a cluster
 */
export function getClusterContent(clusterSlug: string): ContentFile[] {
  const clusterPath = path.join(contentDirectory, clusterSlug);

  if (!fs.existsSync(clusterPath)) {
    return [];
  }

  const files = fs.readdirSync(clusterPath);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));

  return mdxFiles.map(filename => {
    const filePath = path.join(clusterPath, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const slug = filename === 'index.mdx' ? '' : filename.replace('.mdx', '');

    return {
      slug,
      frontmatter: data as ContentFrontmatter,
      content,
    };
  });
}

/**
 * Get a specific content file
 */
export function getContent(clusterSlug: string, pageSlug?: string): ContentFile | null {
  const filename = pageSlug ? `${pageSlug}.mdx` : 'index.mdx';
  const filePath = path.join(contentDirectory, clusterSlug, filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: pageSlug || '',
    frontmatter: data as ContentFrontmatter,
    content,
  };
}

/**
 * Get all clusters that have content
 */
export function getAllClustersWithContent(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const items = fs.readdirSync(contentDirectory, { withFileTypes: true });
  return items
    .filter(item => item.isDirectory())
    .map(item => item.name);
}

/**
 * Get all content pages for static generation
 */
export function getAllContentPaths(): { cluster: string; page?: string }[] {
  const clusters = getAllClustersWithContent();
  const paths: { cluster: string; page?: string }[] = [];

  for (const cluster of clusters) {
    const content = getClusterContent(cluster);

    for (const file of content) {
      if (file.slug === '') {
        // Pillar page
        paths.push({ cluster });
      } else {
        // Supporting page
        paths.push({ cluster, page: file.slug });
      }
    }
  }

  return paths;
}

/**
 * Check if content exists for a given path
 */
export function contentExists(clusterSlug: string, pageSlug?: string): boolean {
  const filename = pageSlug ? `${pageSlug}.mdx` : 'index.mdx';
  const filePath = path.join(contentDirectory, clusterSlug, filename);
  return fs.existsSync(filePath);
}
