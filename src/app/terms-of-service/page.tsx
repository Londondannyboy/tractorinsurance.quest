import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Puppy Insurance Quest. Read our terms and conditions for using our pet insurance comparison service.",
  alternates: {
    canonical: "/terms-of-service",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <p className="text-white/50 text-sm mb-8">Last updated: January 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-white/70 leading-relaxed">
              By accessing and using Puppy Insurance Quest (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Puppy Insurance Quest provides:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Pet insurance information and comparison tools</li>
              <li>AI-powered insurance advisory services</li>
              <li>Quote estimation calculators</li>
              <li>Educational content about pet insurance</li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              We are an information service and comparison platform. We are not an insurance provider, broker, or intermediary. Any quotes provided are estimates for informational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
            <p className="text-white/70 leading-relaxed">
              When you create an account, you must provide accurate information. You are responsible for maintaining the security of your account and password. You must notify us immediately of any unauthorized access to your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
            <p className="text-white/70 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Transmit any viruses or malicious code</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
            <p className="text-white/70 leading-relaxed">
              All content on Puppy Insurance Quest, including text, graphics, logos, and software, is the property of Puppy Insurance Quest or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Disclaimer of Warranties</h2>
            <p className="text-white/70 leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. We do not guarantee that the Service will be uninterrupted, secure, or error-free. Insurance information and quotes are provided for informational purposes only and should not be considered as financial or insurance advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-white/70 leading-relaxed">
              To the maximum extent permitted by law, Puppy Insurance Quest shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. Our total liability shall not exceed the amount paid by you, if any, for using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Third-Party Links</h2>
            <p className="text-white/70 leading-relaxed">
              Our Service may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites. Visiting these links is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Modifications to Terms</h2>
            <p className="text-white/70 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting the updated Terms on this page. Your continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
            <p className="text-white/70 leading-relaxed">
              We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Governing Law</h2>
            <p className="text-white/70 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-amber-400 mt-2">hello@puppyinsurance.quest</p>
          </section>
        </div>
      </div>
    </div>
  );
}
