"use client";

/**
 * DealsEngine
 * ─────────────────────────────────────────────────────────────────────────────
 * Orchestrates all deal logic client-side. Mounted once in the root layout.
 * Reads the current time, cart state, and localStorage to decide which deals
 * are active, then pushes them into the DealsTray via the useDeals store.
 */

import { useEffect, useRef, useCallback } from "react";
import { useDeals, type ActiveDeal } from "@/store/useDeals";
import { useCart } from "@/store/useCart";
import {
  TIME_DEALS,
  CART_DEALS,
} from "@/lib/dealsConfig";
import DealsTray from "./DealsTray";
import WelcomePopup from "./WelcomePopup";
import SpinWheel from "./SpinWheel";

// ─── Countdown helpers ────────────────────────────────────────────────────────

function formatCountdown(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DealsEngine() {
  const { setActiveDeals, dismissedIds } = useDeals();
  const { items, getTotal } = useCart();
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownsRef = useRef<Record<string, number>>({});

  // Build the full list of currently active deals
  const computeDeals = useCallback((): ActiveDeal[] => {
    const deals: ActiveDeal[] = [];
    const now = new Date();
    const hour = now.getHours();

    // ── 1. Time-based deals ──────────────────────────────────────────────────
    for (const td of TIME_DEALS) {
      const active =
        td.endHour === 24
          ? hour >= td.startHour
          : hour >= td.startHour && hour < td.endHour;

      if (active) {
        // Compute seconds remaining
        const endHour = td.endHour === 24 ? 0 : td.endHour;
        const endDate = new Date(now);
        endDate.setHours(endHour, 0, 0, 0);
        if (endDate <= now) endDate.setDate(endDate.getDate() + 1);
        const secsLeft = Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / 1000));
        countdownsRef.current[td.id] = secsLeft;

        deals.push({
          id: td.id,
          type: "time",
          label: `${td.emoji} ${td.label}`,
          description: `${td.discount} — Ends in ${formatCountdown(secsLeft)}`,
          emoji: td.emoji,
          code: td.code,
          accentColor: td.color,
        });
      }
    }

    // ── 2. Cart-based deals ──────────────────────────────────────────────────
    const total = getTotal();
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    const itemNames = items.map((i) => i.name.toLowerCase());

    for (const cd of CART_DEALS) {
      if (cd.type === "threshold") {
        const target = cd.targetCartValue ?? 1500;
        if (total > 0 && total < target) {
          const remaining = target - total;
          deals.push({
            id: cd.id,
            type: "cart",
            label: cd.label,
            description: cd.description.replace("{remaining}", String(Math.ceil(remaining))),
            emoji: cd.emoji,
            accentColor: "#10B981",
          });
        }
      }

      if (cd.type === "upsell" && cd.triggerKeyword) {
        const triggered = itemNames.some((n) => n.includes(cd.triggerKeyword!));
        if (triggered) {
          deals.push({
            id: cd.id,
            type: "cart",
            label: cd.label,
            description: cd.upsellText ?? cd.description,
            emoji: cd.emoji,
            code: cd.code,
            accentColor: "#F59E0B",
          });
        }
      }

      if (cd.type === "bulk" && cd.minItems) {
        if (itemCount >= cd.minItems) {
          deals.push({
            id: cd.id,
            type: "cart",
            label: cd.label,
            description: cd.description.replace("{count}", String(itemCount)),
            emoji: cd.emoji,
            code: cd.code,
            discountPercent: cd.discountPercent,
            accentColor: "#FF5C00",
          });
        }
      }
    }

    return deals;
  }, [items, getTotal]);

  // Track which deals the user has manually dismissed this session
  const dismissedRef = useRef<Set<string>>(new Set());

  // Keep dismissedRef in sync with the store's dismissedIds
  useEffect(() => {
    dismissedRef.current = dismissedIds;
  }, [dismissedIds]);

  // Sync deals into the store
  const syncDeals = useCallback(() => {
    const computed = computeDeals();
    // Filter out deals the user dismissed this session
    const filtered = computed.filter((d) => !dismissedRef.current.has(d.id));
    setActiveDeals(filtered);
  }, [computeDeals, setActiveDeals]);

  useEffect(() => {
    // Initial sync
    syncDeals();

    // Tick every second to update countdowns
    tickRef.current = setInterval(syncDeals, 1000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [syncDeals]);

  return (
    <>
      <DealsTray />
      <WelcomePopup />
      <SpinWheel />
    </>
  );
}
