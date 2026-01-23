import { Metadata } from 'next';
import { PageContent } from '@/components/PageContent';

export const metadata: Metadata = {
  title: 'Compare Tractor Insurance UK | Side-by-Side Plan Comparison',
  description: 'Compare tractor insurance plans side-by-side. See features, prices, and coverage levels from top UK agricultural insurers.',
  keywords: ['compare tractor insurance', 'tractor insurance comparison', 'tractor insurance plans', 'agricultural insurance comparison UK', 'tractor cover comparison'],
  alternates: { canonical: '/compare-tractor-insurance' },
  openGraph: {
    title: 'Compare Tractor Insurance UK | Side-by-Side Plan Comparison',
    description: 'Compare tractor insurance plans side-by-side. See features, prices, and coverage levels from top UK agricultural insurers.',
    url: 'https://tractorinsurance.quest/compare-tractor-insurance',
    siteName: 'Tractor Insurance Quest',
  },
};

export default function CompareTractorInsurancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageContent slug="compare-tractor-insurance" />
      </div>
    </main>
  );
}
