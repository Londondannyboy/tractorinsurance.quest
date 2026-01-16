export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'My Pets | Puppy Insurance',
  description: 'Manage your pets and insurance policies',
};

function AuthNotConfigured() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Auth Not Configured</h1>
        <p className="text-slate-400">Set NEXT_PUBLIC_NEON_AUTH_URL to enable authentication.</p>
      </div>
    </main>
  );
}

export default async function DashboardPage() {
  const hasNeonAuth = !!process.env.NEXT_PUBLIC_NEON_AUTH_URL;

  if (!hasNeonAuth) {
    return <AuthNotConfigured />;
  }

  return <DashboardClient />;
}
