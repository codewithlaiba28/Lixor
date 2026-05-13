"use client";

import { motion } from "framer-motion";
import { X, Tag, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { ActiveDeal } from "@/store/useDeals";
import { useDeals } from "@/store/useDeals";

interface Props {
  deal: ActiveDeal;
  onDismiss: (id: string) => void;
}

export default function DealBanner({ deal, onDismiss }: Props) {
  const [copied, setCopied] = useState(false);
  const { setAppliedCode } = useDeals();

  const handleCopy = () => {
    if (!deal.code) return;
    navigator.clipboard.writeText(deal.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaim = () => {
    if (deal.code) setAppliedCode(deal.code);
    onDismiss(deal.id);
  };

  const accent = deal.accentColor ?? "#FF5C00";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: "spring", damping: 22, stiffness: 280 }}
      className="bg-[#1A1A1A] border border-white/10 rounded-[20px] p-4 shadow-2xl w-[300px] relative overflow-hidden"
    >
      {/* Accent glow */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ backgroundColor: accent }}
      />

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(deal.id)}
        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-all"
        aria-label={`Dismiss ${deal.label} deal`}
      >
        <X size={13} />
      </button>

      <div className="flex items-start gap-3 pr-6">
        {/* Emoji icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: `${accent}20`, border: `1px solid ${accent}30` }}
        >
          {deal.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-0.5">
            {deal.type === "time" ? "Time Deal" : deal.type === "cart" ? "Cart Offer" : "Your Prize"}
          </p>
          <p className="text-sm font-bold text-white leading-tight">{deal.label}</p>
          <p className="text-xs text-neutral-400 mt-0.5 leading-snug">{deal.description}</p>
        </div>
      </div>

      {/* CTA row */}
      <div className="flex items-center gap-2 mt-3">
        {deal.code ? (
          <>
            <button
              onClick={handleClaim}
              className="flex-1 text-xs font-bold text-white py-2 rounded-xl transition-all active:scale-95"
              style={{ backgroundColor: accent }}
            >
              Claim Now
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl transition-all"
              aria-label="Copy code"
            >
              {copied ? (
                <Check size={12} className="text-green-400" />
              ) : (
                <>
                  <Copy size={12} />
                  <span className="font-mono">{deal.code}</span>
                </>
              )}
            </button>
          </>
        ) : (
          <button
            onClick={() => onDismiss(deal.id)}
            className="flex-1 text-xs font-bold text-white py-2 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
            style={{ backgroundColor: accent }}
          >
            <Tag size={12} />
            Add to Cart
          </button>
        )}
      </div>
    </motion.div>
  );
}
