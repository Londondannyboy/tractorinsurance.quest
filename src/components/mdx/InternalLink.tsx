import Link from 'next/link';
import { ReactNode } from 'react';

interface InternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function InternalLink({ href, children, className = '' }: InternalLinkProps) {
  return (
    <Link
      href={href}
      className={`text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}

// Card variant for related articles
interface InternalLinkCardProps {
  href: string;
  title: string;
  description?: string;
  icon?: string;
  category?: string;
}

export function InternalLinkCard({ href, title, description, icon, category }: InternalLinkCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/50 transition-all hover:bg-slate-800/80">
        <div className="flex items-start gap-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <div>
            {category && (
              <span className="text-xs text-emerald-400 uppercase tracking-wider">{category}</span>
            )}
            <h3 className="text-white font-medium group-hover:text-emerald-400 transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-slate-400 text-sm mt-1 line-clamp-2">{description}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default InternalLink;
