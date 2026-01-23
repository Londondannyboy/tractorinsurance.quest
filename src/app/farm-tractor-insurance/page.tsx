import { Metadata } from 'next';
import { PageContent } from '@/components/PageContent';

export const metadata: Metadata = {
  title: 'Farm Tractor Insurance UK | Agricultural Tractor Cover',
  description: 'Specialist insurance for farm tractors. Cover for John Deere, Massey Ferguson, New Holland and all major brands.',
  keywords: ['farm tractor insurance', 'agricultural tractor cover', 'John Deere insurance', 'Massey Ferguson insurance', 'farm machinery insurance UK'],
  alternates: { canonical: '/farm-tractor-insurance' },
  openGraph: {
    title: 'Farm Tractor Insurance UK | Agricultural Tractor Cover',
    description: 'Specialist insurance for farm tractors. Cover for John Deere, Massey Ferguson, New Holland and all major brands.',
    url: 'https://tractorinsurance.quest/farm-tractor-insurance',
    siteName: 'Tractor Insurance Quest',
  },
};

export default function FarmTractorInsurancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageContent slug="farm-tractor-insurance" />
      </div>
    </main>
  );
}
