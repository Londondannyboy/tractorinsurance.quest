"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Cookie, X, Settings } from "lucide-react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay to avoid layout shift
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    setShowBanner(false);
  };

  const acceptSelected = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    setShowBanner(false);
  };

  const rejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[10000] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-stone-900 border border-amber-500/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            {!showPreferences ? (
              // Main Banner
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-xl shrink-0">
                    <Cookie className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-2">
                      We value your privacy
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                      By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                      Read our{" "}
                      <Link href="/privacy-policy" className="text-amber-400 hover:text-amber-300 underline">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/cookie-policy" className="text-amber-400 hover:text-amber-300 underline">
                        Cookie Policy
                      </Link>
                      .
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={acceptAll}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-semibold text-sm rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all"
                      >
                        Accept All
                      </button>
                      <button
                        onClick={rejectAll}
                        className="px-5 py-2.5 bg-stone-800 text-white font-medium text-sm rounded-lg hover:bg-stone-700 transition-colors"
                      >
                        Reject All
                      </button>
                      <button
                        onClick={() => setShowPreferences(true)}
                        className="flex items-center gap-2 px-5 py-2.5 text-amber-400 font-medium text-sm hover:text-amber-300 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Manage Preferences
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={rejectAll}
                    className="p-2 text-white/50 hover:text-white transition-colors shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              // Preferences Panel
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-white text-lg">Cookie Preferences</h3>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="p-2 text-white/50 hover:text-white transition-colors"
                    aria-label="Back"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Necessary */}
                  <div className="flex items-center justify-between p-4 bg-stone-800 rounded-xl">
                    <div>
                      <div className="font-medium text-white">Necessary Cookies</div>
                      <div className="text-white/50 text-sm">Required for the website to function properly</div>
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                      Always On
                    </div>
                  </div>

                  {/* Analytics */}
                  <label className="flex items-center justify-between p-4 bg-stone-800 rounded-xl cursor-pointer hover:bg-stone-700 transition-colors">
                    <div>
                      <div className="font-medium text-white">Analytics Cookies</div>
                      <div className="text-white/50 text-sm">Help us understand how visitors use our site</div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-12 h-7 rounded-full transition-colors ${preferences.analytics ? "bg-amber-500" : "bg-stone-600"}`}>
                        <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${preferences.analytics ? "translate-x-5.5" : "translate-x-0.5"}`} />
                      </div>
                    </div>
                  </label>

                  {/* Marketing */}
                  <label className="flex items-center justify-between p-4 bg-stone-800 rounded-xl cursor-pointer hover:bg-stone-700 transition-colors">
                    <div>
                      <div className="font-medium text-white">Marketing Cookies</div>
                      <div className="text-white/50 text-sm">Used to deliver personalized advertisements</div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-12 h-7 rounded-full transition-colors ${preferences.marketing ? "bg-amber-500" : "bg-stone-600"}`}>
                        <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${preferences.marketing ? "translate-x-5.5" : "translate-x-0.5"}`} />
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={acceptSelected}
                    className="flex-1 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-semibold text-sm rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-5 py-2.5 bg-stone-800 text-white font-medium text-sm rounded-lg hover:bg-stone-700 transition-colors"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
