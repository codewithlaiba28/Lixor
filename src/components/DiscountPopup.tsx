"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Copy, Check } from "lucide-react";

interface Props {
  estimatedMins: number;
  threshold?: number; // default 30
}

const DISCOUNT_CODE = "WAIT10";

export default function DiscountPopup({ estimatedMins, threshold = 30 }: Props) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (estimatedMins > threshold && !dismissed) {
      // Small delay so it doesn't pop instantly
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [estimatedMins, threshold, dismissed]);

  const handleCopy = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Popup */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-6"
          >
            <div className="pointer-events-auto w-full max-w-sm bg-[#1A1A1A] border border-white/10 rounded-[32px] p-8 shadow-2xl text-center relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#FF5C00]/20 rounded-full blur-3xl pointer-events-none" />

              {/* Close */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 bg-[#FF5C00]/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Gift size={28} className="text-[#FF5C00]" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                We know it&apos;s a wait! 🎁
              </h3>
              <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                Your order will take around{" "}
                <span className="text-white font-bold">{estimatedMins} minutes</span>. As a
                thank-you for your patience, here&apos;s{" "}
                <span className="text-[#FF5C00] font-bold">10% off</span> your next order.
              </p>

              {/* Coupon code */}
              <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl px-6 py-4 mb-6 flex items-center justify-between gap-4">
                <span className="font-mono text-2xl font-bold text-[#FF5C00] tracking-widest">
                  {DISCOUNT_CODE}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white transition-colors"
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
                onClick={handleDismiss}
                className="w-full bg-[#FF5C00] hover:bg-[#E65200] text-white py-3.5 rounded-2xl font-bold transition-all text-sm"
              >
                Got it, thanks!
              </button>
              <p className="text-[10px] text-neutral-600 mt-3">
                Valid on your next order. Single use only.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
