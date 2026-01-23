import { Metadata } from 'next';
import { PageContent } from '@/components/PageContent';

export const metadata: Metadata = {
  title: 'Cheap Tractor Insurance UK | Affordable Cover From £25/month',
  description: 'Find cheap tractor insurance without sacrificing quality. Tips to reduce your premium and affordable cover options.',
  keywords: ['cheap tractor insurance', 'affordable tractor insurance', 'budget tractor cover', 'low cost tractor insurance UK', 'tractor insurance deals'],
  alternates: { canonical: '/cheap-tractor-insurance' },
  openGraph: {
    title: 'Cheap Tractor Insurance UK | Affordable Cover From £25/month',
    description: 'Find cheap tractor insurance without sacrificing quality. Tips to reduce your premium and affordable cover options.',
    url: 'https://tractorinsurance.quest/cheap-tractor-insurance',
    siteName: 'Tractor Insurance Quest',
  },
};

export default function CheapTractorInsurancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageContent slug="cheap-tractor-insurance" />
      </div>
    </main>
  );
}
