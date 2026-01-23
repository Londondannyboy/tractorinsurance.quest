import { Metadata } from 'next';
import { PageContent } from '@/components/PageContent';

export const metadata: Metadata = {
  title: 'Garden Tractor Insurance UK | Domestic Tractor Cover',
  description: 'Insurance for garden tractors and domestic ride-on equipment. Affordable cover for larger gardens and properties.',
  keywords: ['garden tractor insurance', 'domestic tractor cover', 'ride-on equipment insurance', 'garden machinery insurance', 'property tractor cover UK'],
  alternates: { canonical: '/garden-tractor-insurance' },
  openGraph: {
    title: 'Garden Tractor Insurance UK | Domestic Tractor Cover',
    description: 'Insurance for garden tractors and domestic ride-on equipment. Affordable cover for larger gardens and properties.',
    url: 'https://tractorinsurance.quest/garden-tractor-insurance',
    siteName: 'Tractor Insurance Quest',
  },
};

export default function GardenTractorInsurancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageContent slug="garden-tractor-insurance" />
      </div>
    </main>
  );
}
