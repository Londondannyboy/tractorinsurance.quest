import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NeonAuthUIProvider } from "@/lib/auth/client";
import { authClient } from "@/lib/auth/client";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
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
  title: {
    default: "Compare Tractor Insurance | Compare Tractor Insurance Quest",
    template: "%s | Compare Tractor Insurance Quest",
  },
  description:
    "Compare Tractor Insurance with Compare Tractor Insurance Quest. Get instant quotes to compare tractor insurance for farm tractors, vintage tractors, compact tractors & more. AI-powered advisor helps you compare tractor insurance and find the perfect coverage.",
  keywords: [
    "tractor insurance",
    "tractor insurance UK",
    "farm tractor insurance",
    "agricultural vehicle insurance",
    "cheap tractor insurance",
    "vintage tractor insurance",
    "compact tractor insurance",
    "ride on mower insurance",
    "tractor insurance cost",
    "compare tractor insurance",
  ],
  authors: [{ name: "Compare Tractor Insurance Quest" }],
  creator: "Compare Tractor Insurance Quest",
  publisher: "Compare Tractor Insurance Quest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://tractorinsurance.quest"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Compare Tractor Insurance | Compare Tractor Insurance Quest",
    description:
      "Compare Tractor Insurance with Compare Tractor Insurance Quest. Get instant quotes with our AI-powered advisor to compare tractor insurance.",
    url: "https://tractorinsurance.quest",
    siteName: "Compare Tractor Insurance Quest",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Tractor Insurance | Compare Tractor Insurance Quest",
    description: "Compare Tractor Insurance with Compare Tractor Insurance Quest. AI-powered quotes to compare tractor insurance for all tractor types.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Compare Tractor Insurance Quest" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-950 text-white min-h-screen flex flex-col`}
      >
        <NeonAuthUIProvider
          authClient={authClient as Parameters<typeof NeonAuthUIProvider>[0]["authClient"]}
          redirectTo="/dashboard"
          emailOTP
          social={{ providers: ["google"] }}
        >
          <Header />
          <main className="flex-1 pt-[5.25rem]">
            <Providers>{children}</Providers>
          </main>
          <Footer />
          <CookieConsent />
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
