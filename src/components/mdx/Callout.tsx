'use client';

import { ReactNode } from 'react';

export type CalloutType = 'info' | 'warning' | 'tip' | 'important' | 'example';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutStyles: Record<CalloutType, { bg: string; border: string; icon: string; title: string }> = {
  info: {
    bg: 'bg-blue-900/20',
    border: 'border-blue-500/30',
    icon: 'ℹ️',
    title: 'text-blue-400',
  },
  warning: {
    bg: 'bg-amber-900/20',
    border: 'border-amber-500/30',
    icon: '⚠️',
    title: 'text-amber-400',
  },
  tip: {
    bg: 'bg-emerald-900/20',
    border: 'border-emerald-500/30',
    icon: '💡',
    title: 'text-emerald-400',
  },
  important: {
    bg: 'bg-red-900/20',
    border: 'border-red-500/30',
    icon: '🚨',
    title: 'text-red-400',
  },
  example: {
    bg: 'bg-violet-900/20',
    border: 'border-violet-500/30',
    icon: '📝',
    title: 'text-violet-400',
  },
};

const defaultTitles: Record<CalloutType, string> = {
  info: 'Information',
  warning: 'Warning',
  tip: 'Tip',
  important: 'Important',
  example: 'Example',
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = calloutStyles[type];
  const displayTitle = title || defaultTitles[type];

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-xl p-5 my-6`}>
      <div className={`flex items-center gap-2 ${styles.title} font-semibold mb-2`}>
        <span>{styles.icon}</span>
        <span>{displayTitle}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default Callout;
