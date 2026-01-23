import { Metadata } from 'next';
import { PageContent } from '@/components/PageContent';

export const metadata: Metadata = {
  title: 'Vintage Tractor Insurance UK | Classic Tractor Specialist Cover',
  description: 'Specialist insurance for vintage and classic tractors. Agreed value cover, rally protection, and restoration cover.',
  keywords: ['vintage tractor insurance', 'classic tractor insurance', 'agreed value tractor cover', 'tractor rally insurance', 'restoration tractor insurance UK'],
  alternates: { canonical: '/vintage-tractor-insurance' },
  openGraph: {
    title: 'Vintage Tractor Insurance UK | Classic Tractor Specialist Cover',
    description: 'Specialist insurance for vintage and classic tractors. Agreed value cover, rally protection, and restoration cover.',
    url: 'https://tractorinsurance.quest/vintage-tractor-insurance',
    siteName: 'Tractor Insurance Quest',
  },
};

export default function VintageTractorInsurancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageContent slug="vintage-tractor-insurance" />
      </div>
    </main>
  );
}
