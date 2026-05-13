"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDeals } from "@/store/useDeals";
import DealBanner from "./DealBanner";
import { DEAL_DISPLAY } from "@/lib/dealsConfig";

export default function DealsTray() {
  const { activeDeals, removeDeal } = useDeals();

  // Show max N banners
  const visible = activeDeals.slice(0, DEAL_DISPLAY.maxBanners);

  return (
    <div
      className="fixed bottom-6 left-6 z-40 flex flex-col-reverse gap-3 pointer-events-none"
      aria-live="polite"
      aria-label="Deal notifications"
    >
      <AnimatePresence mode="popLayout">
        {visible.map((deal) => (
          <div key={deal.id} className="pointer-events-auto">
            <DealBanner deal={deal} onDismiss={removeDeal} />
          </div>
        ))}
      </AnimatePresence>

      {/* Overflow indicator */}
      <AnimatePresence>
        {activeDeals.length > DEAL_DISPLAY.maxBanners && (
          <motion.div
            key="overflow"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-auto bg-[#1A1A1A] border border-white/10 rounded-full px-4 py-2 text-xs font-bold text-neutral-400 shadow-lg"
          >
            +{activeDeals.length - DEAL_DISPLAY.maxBanners} more deal
            {activeDeals.length - DEAL_DISPLAY.maxBanners > 1 ? "s" : ""} available
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
