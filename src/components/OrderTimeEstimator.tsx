"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, ChevronDown } from "lucide-react";
import {
  calculateEstimatedTime,
  DELIVERY_ZONES,
  isPeakHour,
  type OrderType,
} from "@/lib/orderTimePrediction";
import type { CartItem } from "@/store/useCart";

interface Props {
  items: CartItem[];
  orderType: OrderType;
  deliveryZone: string;
  onDeliveryZoneChange: (zone: string) => void;
}

const TIMELINE_STEPS = [
  { id: "placed", label: "Order Placed" },
  { id: "preparing", label: "Preparing" },
  { id: "ready", label: "Ready / Out for Delivery" },
];

export default function OrderTimeEstimator({
  items,
  orderType,
  deliveryZone,
  onDeliveryZoneChange,
}: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const estimate = useMemo(
    () =>
      calculateEstimatedTime(
        items.map((i) => ({ id: i.id, quantity: i.quantity })),
        orderType,
        deliveryZone
      ),
    [items, orderType, deliveryZone]
  );

  const peak = isPeakHour();

  if (items.length === 0) return null;

  // Active step: 0 = placed (always), 1 = preparing (always after placed), 2 = ready (not yet)
  const activeStep = 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FF5C00]/20 flex items-center justify-center flex-shrink-0">
          <Clock size={18} className="text-[#FF5C00]" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Estimated Ready Time
          </p>
          <p className="text-white font-bold text-lg leading-tight">
            {estimate.minMins}–{estimate.maxMins} minutes
          </p>
        </div>
        {peak && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
            <Zap size={10} />
            Peak Hours
          </span>
        )}
      </div>

      {/* Visual timeline */}
      <div className="flex items-center gap-0">
        {TIMELINE_STEPS.map((step, i) => {
          const isActive = i <= activeStep;
          const isLast = i === TIMELINE_STEPS.length - 1;
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                    isActive
                      ? "bg-[#FF5C00] border-[#FF5C00] text-white"
                      : "bg-white/5 border-white/20 text-white/30"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-[9px] font-bold text-center leading-tight max-w-[64px] ${
                    isActive ? "text-white" : "text-white/30"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-[2px] mx-1 mb-4 rounded-full transition-all ${
                    i < activeStep ? "bg-[#FF5C00]" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Delivery zone selector */}
      {orderType === "Delivery" && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Delivery Zone
          </label>
          <select
            value={deliveryZone}
            onChange={(e) => onDeliveryZoneChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF5C00]/50 transition-colors"
          >
            <option value="" className="bg-[#1A1A1A]">
              Select your area…
            </option>
            {DELIVERY_ZONES.map((z) => (
              <option key={z.value} value={z.value} className="bg-[#1A1A1A]">
                {z.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Breakdown toggle */}
      <button
        onClick={() => setShowBreakdown((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors"
      >
        <ChevronDown
          size={13}
          className={`transition-transform ${showBreakdown ? "rotate-180" : ""}`}
        />
        {showBreakdown ? "Hide" : "Show"} time breakdown
      </button>

      <AnimatePresence>
        {showBreakdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-1 border-t border-white/10">
              <BreakdownRow
                label="Base prep time"
                value={`${estimate.basePrepTime} min`}
                sub="(max item + parallel cooking)"
              />
              <BreakdownRow
                label={peak ? "Kitchen load (peak)" : "Kitchen load (off-peak)"}
                value={`+${estimate.kitchenBuffer} min`}
                highlight={peak}
              />
              {estimate.deliveryBuffer > 0 && (
                <BreakdownRow
                  label="Delivery buffer"
                  value={`+${estimate.deliveryBuffer} min`}
                />
              )}
              {estimate.dineInDiscount > 0 && (
                <BreakdownRow
                  label="Dine-in discount"
                  value={`−${estimate.dineInDiscount} min`}
                  positive
                />
              )}
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-xs font-bold text-white">Estimated total</span>
                <span className="text-xs font-bold text-[#FF5C00]">
                  {estimate.minMins}–{estimate.maxMins} min
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BreakdownRow({
  label,
  value,
  sub,
  highlight,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className={`text-xs ${highlight ? "text-amber-400" : "text-neutral-400"}`}>
          {label}
        </span>
        {sub && <span className="text-[10px] text-neutral-600 ml-1">{sub}</span>}
      </div>
      <span
        className={`text-xs font-bold ${
          positive ? "text-green-400" : highlight ? "text-amber-400" : "text-white/70"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
