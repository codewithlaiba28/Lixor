"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Copy, Check, Sparkles } from "lucide-react";
import { WELCOME_DEAL, DEAL_DISPLAY } from "@/lib/dealsConfig";
import { useDeals } from "@/store/useDeals";

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { welcomeDismissed, setWelcomeDismissed, setAppliedCode } = useDeals();

  useEffect(() => {
    // Only run on client
    try {
      const isFirstVisit = !localStorage.getItem(DEAL_DISPLAY.firstVisitKey);
      const alreadyDismissed = !!localStorage.getItem(DEAL_DISPLAY.welcomeDismissedKey);

      if (isFirstVisit && !alreadyDismissed && !welcomeDismissed) {
        // Mark as visited
        localStorage.setItem(DEAL_DISPLAY.firstVisitKey, "1");
        // Show popup after a short delay
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage unavailable (SSR guard)
    }
  }, [welcomeDismissed]);

  const handleCopy = () => {
    navigator.clipboard.writeText(WELCOME_DEAL.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaim = () => {
    setAppliedCode(WELCOME_DEAL.code);
    handleDismiss();
  };

  const handleDismiss = () => {
    setVisible(false);
    setWelcomeDismissed(true);
    try {
      localStorage.setItem(DEAL_DISPLAY.welcomeDismissedKey, "1");
    } catch { /* ignore */ }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="welcome-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Popup */}
          <motion.div
            key="welcome-popup"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
            className="fixed inset-0 flex items-center justify-center z-[61] pointer-events-none px-6"
          >
            <div className="pointer-events-auto w-full max-w-sm bg-[#1A1A1A] border border-white/10 rounded-[32px] p-8 shadow-2xl text-center relative overflow-hidden">
              {/* Decorative glows */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FF5C00]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all"
                aria-label="Close welcome popup"
              >
                <X size={16} />
              </button>

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#FF5C00]/20 text-[#FF5C00] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                <Sparkles size={10} />
                First Visit Offer
              </div>

              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF5C00]/30 to-[#FF5C00]/10 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-[#FF5C00]/20">
                <Gift size={32} className="text-[#FF5C00]" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Welcome! {WELCOME_DEAL.emoji}
              </h3>
              <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                First order? Get{" "}
                <span className="text-[#FF5C00] font-bold">{WELCOME_DEAL.discount}</span>{" "}
                on your entire order. Code auto-applies at checkout!
              </p>

              {/* Coupon code */}
              <div className="bg-white/5 border border-dashed border-[#FF5C00]/40 rounded-2xl px-6 py-4 mb-6 flex items-center justify-between gap-4">
                <span className="font-mono text-2xl font-bold text-[#FF5C00] tracking-widest">
                  {WELCOME_DEAL.code}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white transition-colors"
                  aria-label="Copy discount code"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleClaim}
                className="w-full bg-[#FF5C00] hover:bg-[#E65200] text-white py-3.5 rounded-2xl font-bold transition-all text-sm shadow-lg shadow-orange-500/20 active:scale-95"
              >
                Claim My 20% Off →
              </button>
              <p className="text-[10px] text-neutral-600 mt-3">
                Valid on your first order only. Single use.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
