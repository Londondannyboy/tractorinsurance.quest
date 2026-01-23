"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle, Calculator, Shield } from "lucide-react";

interface CTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
  variant?: "primary" | "secondary" | "chat";
}

export function CallToAction({
  title = "Ready to Protect Your Tractor?",
  description = "Get a personalized quote in minutes with our AI-powered advisor.",
  buttonText = "Get Your Quote",
  href = "/",
  variant = "primary",
}: CTAProps) {
  const variants = {
    primary: "from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400",
    secondary: "from-stone-700 to-stone-600 hover:from-stone-600 hover:to-stone-500",
    chat: "from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-amber-900/30 via-orange-900/30 to-amber-900/30 border border-amber-500/30 rounded-2xl p-8 md:p-12 my-12 text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
      <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">{description}</p>
      <Link
        href={href}
        className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${variants[variant]} text-stone-950 font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/25 text-lg`}
      >
        {variant === "chat" && <MessageCircle className="w-5 h-5" />}
        {buttonText}
        <ArrowRight className="w-5 h-5" />
      </Link>
    </motion.div>
  );
}

// Smaller inline CTA
export function InlineCTA({
  text = "Compare plans now",
  href = "/compare-pet-insurance",
}: {
  text?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 font-medium rounded-lg hover:bg-amber-500/30 transition-colors my-4"
    >
      {text}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}

// Feature highlight boxes
interface FeatureBoxProps {
  icon?: "shield" | "calculator" | "message";
  title: string;
  description: string;
}

export function FeatureBox({ icon = "shield", title, description }: FeatureBoxProps) {
  const icons = {
    shield: Shield,
    calculator: Calculator,
    message: MessageCircle,
  };
  const Icon = icons[icon];

  return (
    <div className="bg-stone-900/50 border border-stone-700 rounded-xl p-6 hover:border-amber-500/30 transition-colors">
      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-amber-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export function FeatureGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {children}
    </div>
  );
}
