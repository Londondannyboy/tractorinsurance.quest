import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Tractor Insurance Quest. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-white/50 text-sm mb-8">Last updated: January 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="text-white/70 leading-relaxed">
              Tractor Insurance Quest (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website tractorinsurance.quest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">Personal Information</h3>
            <p className="text-white/70 leading-relaxed mb-4">We may collect personal information that you voluntarily provide, including:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Name and email address (when creating an account)</li>
              <li>Vehicle information (type, age, condition) for quote purposes</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">Automatically Collected Information</h3>
            <p className="text-white/70 leading-relaxed mb-4">When you visit our site, we automatically collect:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>Operating system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-white/70 leading-relaxed mb-4">We use collected information to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Provide and improve our services</li>
              <li>Generate insurance quotes and recommendations</li>
              <li>Personalize your experience</li>
              <li>Communicate with you about our services</li>
              <li>Analyze usage patterns to improve our website</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Cookies and Tracking</h2>
            <p className="text-white/70 leading-relaxed mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li><strong>Necessary cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements (with consent)</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              You can manage your cookie preferences through the cookie consent banner or your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing</h2>
            <p className="text-white/70 leading-relaxed mb-4">We may share your information with:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li><strong>Service providers:</strong> Third parties who help us operate our website (hosting, analytics)</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business transfers:</strong> In connection with a merger or acquisition</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Data Security</h2>
            <p className="text-white/70 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights (GDPR)</h2>
            <p className="text-white/70 leading-relaxed mb-4">Under UK GDPR, you have the right to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
              <li><strong>Restriction:</strong> Request limitation of processing</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Object:</strong> Object to processing for direct marketing</li>
              <li><strong>Withdraw consent:</strong> Withdraw consent at any time</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              To exercise these rights, contact us at hello@tractorinsurance.quest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Data Retention</h2>
            <p className="text-white/70 leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Account data is retained while your account is active and for a reasonable period afterward.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-white/70 leading-relaxed">
              Our Service is not directed to children under 16. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. International Transfers</h2>
            <p className="text-white/70 leading-relaxed">
              Your information may be transferred to and processed in countries outside the UK/EEA. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Policy</h2>
            <p className="text-white/70 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              For questions about this Privacy Policy or to exercise your data rights, contact us at:
            </p>
            <p className="text-amber-400 mt-2">hello@tractorinsurance.quest</p>
            <p className="text-white/70 mt-4">
              You also have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) if you believe your data protection rights have been violated.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
