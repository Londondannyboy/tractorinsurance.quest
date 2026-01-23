import { Metadata } from 'next';
import { PageContent } from '@/components/PageContent';

export const metadata: Metadata = {
  title: 'Ride-on Mower Insurance UK | Groundcare Equipment Cover',
  description: 'Insurance for ride-on mowers and groundcare equipment. Cover for sit-on, zero-turn, and commercial mowers.',
  keywords: ['ride-on mower insurance', 'groundcare equipment cover', 'sit-on mower insurance', 'zero-turn mower insurance', 'commercial mower insurance UK'],
  alternates: { canonical: '/ride-on-mower-insurance' },
  openGraph: {
    title: 'Ride-on Mower Insurance UK | Groundcare Equipment Cover',
    description: 'Insurance for ride-on mowers and groundcare equipment. Cover for sit-on, zero-turn, and commercial mowers.',
    url: 'https://tractorinsurance.quest/ride-on-mower-insurance',
    siteName: 'Tractor Insurance Quest',
  },
};

export default function RideOnMowerInsurancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageContent slug="ride-on-mower-insurance" />
      </div>
    </main>
  );
}
