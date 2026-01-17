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
    default: "Puppy Insurance UK | Compare Pet Insurance for Puppies & Dogs",
    template: "%s | Puppy Insurance Quest",
  },
  description:
    "Compare the best puppy insurance in the UK. Get instant quotes for Jack Russell, Pug, Cockapoo & more breeds. AI-powered pet insurance advisor helps you find the perfect coverage.",
  keywords: [
    "puppy insurance",
    "pet insurance puppies",
    "dog insurance UK",
    "best pet insurance for puppies",
    "cheap puppy insurance",
    "jack russell insurance",
    "pug insurance",
    "cockapoo insurance",
    "puppy insurance cost",
    "compare pet insurance",
  ],
  authors: [{ name: "Puppy Insurance Quest" }],
  creator: "Puppy Insurance Quest",
  publisher: "Puppy Insurance Quest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://puppyinsurance.quest"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Puppy Insurance UK | Compare Pet Insurance for Puppies & Dogs",
    description:
      "Compare the best puppy insurance in the UK. Get instant quotes with our AI-powered pet insurance advisor.",
    url: "https://puppyinsurance.quest",
    siteName: "Puppy Insurance Quest",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Puppy Insurance UK | Compare Pet Insurance",
    description: "Compare the best puppy insurance in the UK. AI-powered quotes for all breeds.",
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
        <meta name="apple-mobile-web-app-title" content="Puppy Insurance Quest" />
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
          <main className="flex-1 pt-16">
            <Providers>{children}</Providers>
          </main>
          <Footer />
          <CookieConsent />
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
