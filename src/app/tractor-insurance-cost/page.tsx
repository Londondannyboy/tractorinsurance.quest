import { Metadata } from 'next';
import { PageContent } from '@/components/PageContent';

export const metadata: Metadata = {
  title: 'Tractor Insurance Cost UK 2025 | How Much Does It Cost?',
  description: 'Find out how much tractor insurance costs in the UK. Comprehensive pricing guide with costs by type, age, and coverage.',
  keywords: ['tractor insurance cost', 'how much is tractor insurance', 'tractor insurance price', 'tractor insurance quotes', 'agricultural insurance cost UK'],
  alternates: { canonical: '/tractor-insurance-cost' },
  openGraph: {
    title: 'Tractor Insurance Cost UK 2025 | How Much Does It Cost?',
    description: 'Find out how much tractor insurance costs in the UK. Comprehensive pricing guide with costs by type, age, and coverage.',
    url: 'https://tractorinsurance.quest/tractor-insurance-cost',
    siteName: 'Tractor Insurance Quest',
  },
};

export default function TractorInsuranceCostPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageContent slug="tractor-insurance-cost" />
      </div>
    </main>
  );
}
