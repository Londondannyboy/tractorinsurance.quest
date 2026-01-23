'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authClient } from '@/lib/auth/client';
import { HumeWidget } from '@/components/HumeWidget';

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface UserTractor {
  id: number;
  name: string;
  breed_name: string;
  age_years: number;
  has_preexisting_conditions: boolean;
}

interface Policy {
  id: number;
  policy_number: string;
  plan_type: string;
  monthly_premium: number;
  status: string;
  dog_name: string;
}

export default function DashboardClient() {
  const [user, setUser] = useState<User | null>(null);
  const [tractors, setTractors] = useState<UserTractor[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await authClient.getSession();
        if (data?.user) {
          setUser(data.user as User);
          // In a real app, fetch tractors and policies from API
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center pt-28">
        <div className="text-center">
          <div className="text-6xl mb-4">🚜</div>
          <h2 className="text-2xl font-bold text-white mb-4">Sign in to manage your tractors</h2>
          <Link
            href="/auth/sign-in"
            className="inline-block px-6 py-3 bg-amber-500 text-stone-900 rounded-full font-semibold hover:bg-amber-400 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-8 pt-28">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}! 🚜
          </h1>
          <p className="text-white/70">Manage your tractors and insurance policies</p>
        </motion.div>

        {/* Voice Widget */}
        <div className="mb-8">
          <HumeWidget />
        </div>

        {/* My Tractors Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">My Tractors</h2>

          {tractors.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
              <div className="text-5xl mb-4">🚜</div>
              <h3 className="text-xl font-semibold text-white mb-2">No tractors registered yet</h3>
              <p className="text-white/60 mb-6">Add your tractor to get personalised insurance quotes</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-amber-500 text-stone-900 rounded-full font-semibold hover:bg-amber-400 transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {tractors.map((tractor) => (
                <div
                  key={tractor.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">🚜</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{tractor.name}</h3>
                      <p className="text-white/60">{tractor.breed_name} &bull; {tractor.age_years} years old</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Active Policies Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-4">Active Policies</h2>

          {policies.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-white mb-2">No active policies</h3>
              <p className="text-white/60 mb-6">Get a quote and protect your tractor today!</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-400 transition-colors"
              >
                View Plans
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-white">{policy.dog_name}</h3>
                      <p className="text-white/60">{policy.plan_type} Plan &bull; {policy.policy_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-400">&pound;{policy.monthly_premium}/mo</p>
                      <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-full">
                        {policy.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/"
              className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 text-center hover:bg-amber-500/30 transition-colors"
            >
              <span className="text-2xl block mb-2">💰</span>
              <span className="text-white font-medium">Get Quote</span>
            </Link>
            <Link
              href="/"
              className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center hover:bg-blue-500/30 transition-colors"
            >
              <span className="text-2xl block mb-2">📞</span>
              <span className="text-white font-medium">Talk to Tracker</span>
            </Link>
            <Link
              href="/account/settings"
              className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center hover:bg-purple-500/30 transition-colors"
            >
              <span className="text-2xl block mb-2">⚙️</span>
              <span className="text-white font-medium">Settings</span>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
