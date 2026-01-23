import { Metadata } from 'next';
import { PageContent } from '@/components/PageContent';

export const metadata: Metadata = {
  title: 'Utility Tractor Insurance UK | All-Purpose Tractor Cover',
  description: 'Insurance for utility tractors used for loading, mowing, and cultivation. Mid-range cover for versatile machinery.',
  keywords: ['utility tractor insurance', 'all-purpose tractor cover', 'mid-range tractor insurance', 'loader tractor insurance', 'utility farm equipment cover UK'],
  alternates: { canonical: '/utility-tractor-insurance' },
  openGraph: {
    title: 'Utility Tractor Insurance UK | All-Purpose Tractor Cover',
    description: 'Insurance for utility tractors used for loading, mowing, and cultivation. Mid-range cover for versatile machinery.',
    url: 'https://tractorinsurance.quest/utility-tractor-insurance',
    siteName: 'Tractor Insurance Quest',
  },
};

export default function UtilityTractorInsurancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageContent slug="utility-tractor-insurance" />
      </div>
    </main>
  );
}
