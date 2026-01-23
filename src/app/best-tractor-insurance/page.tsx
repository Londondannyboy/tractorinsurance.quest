import { Metadata } from 'next';
import { PageContent } from '@/components/PageContent';

export const metadata: Metadata = {
  title: 'Best Tractor Insurance UK 2025 | Top Providers Compared',
  description: 'Find the best tractor insurance providers in the UK. We compare cover, features, and prices from leading agricultural insurers.',
  keywords: ['best tractor insurance', 'top tractor insurance UK', 'tractor insurance providers', 'agricultural insurer comparison', 'tractor insurance reviews'],
  alternates: { canonical: '/best-tractor-insurance' },
  openGraph: {
    title: 'Best Tractor Insurance UK 2025 | Top Providers Compared',
    description: 'Find the best tractor insurance providers in the UK. We compare cover, features, and prices from leading agricultural insurers.',
    url: 'https://tractorinsurance.quest/best-tractor-insurance',
    siteName: 'Tractor Insurance Quest',
  },
};

export default function BestTractorInsurancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageContent slug="best-tractor-insurance" />
      </div>
    </main>
  );
}
