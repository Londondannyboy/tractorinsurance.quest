import { Metadata } from 'next';
import { PageContent } from '@/components/PageContent';

export const metadata: Metadata = {
  title: 'Tractor Insurance UK | Complete Guide to Insuring Your Tractor',
  description: 'Everything you need to know about tractor insurance in the UK. Compare policies, understand coverage options, and find the best deal.',
  keywords: ['tractor insurance', 'tractor insurance UK', 'agricultural insurance', 'farm vehicle insurance', 'tractor cover'],
  alternates: { canonical: '/tractor-insurance' },
  openGraph: {
    title: 'Tractor Insurance UK | Complete Guide to Insuring Your Tractor',
    description: 'Everything you need to know about tractor insurance in the UK. Compare policies, understand coverage options, and find the best deal.',
    url: 'https://tractorinsurance.quest/tractor-insurance',
    siteName: 'Tractor Insurance Quest',
  },
};

export default function TractorInsurancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageContent slug="tractor-insurance" />
      </div>
    </main>
  );
}
