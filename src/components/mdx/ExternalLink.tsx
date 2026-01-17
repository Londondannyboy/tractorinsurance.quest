import { ReactNode } from 'react';

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  source?: string;
  className?: string;
}

export function ExternalLink({ href, children, source, className = '' }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors inline-flex items-center gap-1 ${className}`}
    >
      {children}
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

// Card variant for official sources
interface ExternalLinkCardProps {
  href: string;
  title: string;
  source: string;
  description?: string;
  trusted?: boolean;
}

export function ExternalLinkCard({ href, title, source, description, trusted = false }: ExternalLinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/50 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {trusted && (
                <span className="text-emerald-400 text-xs">✓ Official</span>
              )}
              <span className="text-slate-500 text-xs">{source}</span>
            </div>
            <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors text-sm">
              {title}
            </h4>
            {description && (
              <p className="text-slate-400 text-xs mt-1">{description}</p>
            )}
          </div>
          <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </a>
  );
}

export default ExternalLink;
