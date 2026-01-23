import { Metadata } from 'next';
import { PageContent } from '@/components/PageContent';

export const metadata: Metadata = {
  title: 'Compact Tractor Insurance UK | Cover for Small Tractors',
  description: 'Insurance for compact tractors from Kubota, Iseki, and Yanmar. Affordable cover for smallholdings and estates.',
  keywords: ['compact tractor insurance', 'small tractor insurance', 'Kubota insurance', 'Iseki insurance', 'smallholding tractor cover UK'],
  alternates: { canonical: '/compact-tractor-insurance' },
  openGraph: {
    title: 'Compact Tractor Insurance UK | Cover for Small Tractors',
    description: 'Insurance for compact tractors from Kubota, Iseki, and Yanmar. Affordable cover for smallholdings and estates.',
    url: 'https://tractorinsurance.quest/compact-tractor-insurance',
    siteName: 'Tractor Insurance Quest',
  },
};

export default function CompactTractorInsurancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageContent slug="compact-tractor-insurance" />
      </div>
    </main>
  );
}
