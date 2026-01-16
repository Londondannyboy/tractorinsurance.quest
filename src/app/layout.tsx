import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NeonAuthUIProvider, UserButton } from "@/lib/auth/client";
import { authClient } from "@/lib/auth/client";
import { Providers } from "@/components/providers";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Puppy Insurance Quest - AI Pet Insurance Advisor",
  description: "Your voice-first AI guide to pet insurance. Get personalized quotes for your furry friend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-950 text-white`}
      >
        <NeonAuthUIProvider
          authClient={authClient as any}
          redirectTo="/dashboard"
          emailOTP
          social={{ providers: ['google'] }}
        >
          <header className="fixed top-0 left-0 right-0 h-14 bg-slate-900/95 backdrop-blur-sm z-[9999] flex items-center justify-between px-6 border-b border-slate-800">
            {/* Logo / Brand */}
            <a href="/" className="flex items-center gap-2 text-white font-semibold text-lg">
              <span className="text-2xl">🐾</span>
              <span>Puppy Insurance</span>
            </a>

            {/* Navigation Links */}
            <nav className="flex items-center gap-6">
              <a href="/" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
                Get Quote
              </a>
              <a href="/dashboard" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
                My Pets
              </a>
              <UserButton size="icon" />
            </nav>
          </header>
          <div className="pt-14">
            <Providers>
              {children}
            </Providers>
          </div>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
