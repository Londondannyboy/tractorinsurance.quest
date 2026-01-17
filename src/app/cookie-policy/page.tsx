import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for Puppy Insurance Quest. Learn about how we use cookies and tracking technologies.",
  alternates: {
    canonical: "/cookie-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>
        <p className="text-white/50 text-sm mb-8">Last updated: January 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies?</h2>
            <p className="text-white/70 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience. This policy explains how Puppy Insurance Quest uses cookies and similar technologies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Types of Cookies We Use</h2>

            <div className="bg-stone-900/50 border border-stone-700 rounded-xl p-6 mb-4">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Necessary Cookies</h3>
              <p className="text-white/70 text-sm mb-2">Required for basic website functionality. Cannot be disabled.</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Session management</li>
                <li>• Authentication</li>
                <li>• Security features</li>
                <li>• Cookie consent preferences</li>
              </ul>
            </div>

            <div className="bg-stone-900/50 border border-stone-700 rounded-xl p-6 mb-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Analytics Cookies</h3>
              <p className="text-white/70 text-sm mb-2">Help us understand how visitors use our website.</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Page views and navigation</li>
                <li>• Time spent on pages</li>
                <li>• Traffic sources</li>
                <li>• Device and browser information</li>
              </ul>
            </div>

            <div className="bg-stone-900/50 border border-stone-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Marketing Cookies</h3>
              <p className="text-white/70 text-sm mb-2">Used to deliver relevant advertisements (optional).</p>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Personalized advertising</li>
                <li>• Conversion tracking</li>
                <li>• Retargeting</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We may use cookies from the following third-party services:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li><strong>Google Analytics:</strong> Website analytics and usage statistics</li>
              <li><strong>Neon Auth:</strong> User authentication services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Managing Your Cookie Preferences</h2>
            <p className="text-white/70 leading-relaxed mb-4">You can manage cookies through:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li><strong>Our cookie banner:</strong> Click &quot;Manage Preferences&quot; to choose which cookies to accept</li>
              <li><strong>Browser settings:</strong> Most browsers allow you to block or delete cookies</li>
              <li><strong>Opt-out tools:</strong> Use industry opt-out tools for advertising cookies</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              Note: Blocking necessary cookies may affect website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cookie Duration</h2>
            <p className="text-white/70 leading-relaxed">
              <strong>Session cookies:</strong> Deleted when you close your browser.<br/>
              <strong>Persistent cookies:</strong> Remain on your device for a set period (typically 1-12 months) or until you delete them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
            <p className="text-white/70 leading-relaxed">
              We may update this Cookie Policy periodically. Changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              For questions about our use of cookies, contact us at:
            </p>
            <p className="text-amber-400 mt-2">hello@puppyinsurance.quest</p>
          </section>
        </div>
      </div>
    </div>
  );
}
