"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, X, CheckCircle } from "lucide-react";
import Link from "next/link";
import {
  getTrackerStages,
  adminStatusToStageIndex,
  type OrderType,
} from "@/lib/orderTimePrediction";
import { clearTrackerState } from "@/components/OrderTracker";

interface LastOrder {
  orderId: string;
  orderType: OrderType;
  estimatedMins: number;
  placedAt: number;
}

interface TrackerState {
  currentStage: number;
  savedAt: number;
  totalSecs: number;
  elapsedSecs: number;
}

const LS_ORDER_KEY = "lixor-last-order";
const LS_TRACKER_KEY = "lixor-tracker-state";

function readLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export default function FloatingOrderTracker() {
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    setMounted(true);

    const lastOrder = readLS<LastOrder>(LS_ORDER_KEY);
    if (!lastOrder) return;

    // Only show if order was placed within the last 3 hours
    const threeHours = 3 * 60 * 60 * 1000;
    if (Date.now() - lastOrder.placedAt > threeHours) return;

    setOrder(lastOrder);

    const saved = readLS<TrackerState>(LS_TRACKER_KEY);
    const totalSecs = lastOrder.estimatedMins * 60;

    let startElapsed = 0;
    if (saved) {
      const passedSince = Math.floor((Date.now() - saved.savedAt) / 1000);
      startElapsed = saved.elapsedSecs + passedSince;
    } else {
      startElapsed = Math.floor((Date.now() - lastOrder.placedAt) / 1000);
    }

    elapsedRef.current = startElapsed;
    const remaining = Math.max(0, totalSecs - startElapsed);
    setCountdown(remaining);

    const stages = getTrackerStages(lastOrder.orderType, lastOrder.estimatedMins);

    // Derive current stage from elapsed time
    let acc = 0;
    let stage = 0;
    for (let i = 0; i < stages.length - 1; i++) {
      acc += stages[i].durationSecs;
      if (startElapsed >= acc) stage = i + 1;
    }
    setCurrentStage(stage);

    // Time-based stage advancement
    function scheduleNext(fromStage: number, fromElapsed: number) {
      if (fromStage >= stages.length - 1) return;
      let boundary = 0;
      for (let i = 0; i <= fromStage; i++) boundary += stages[i].durationSecs;
      const msUntilNext = Math.max(0, (boundary - fromElapsed) * 1000);
      stageTimerRef.current = setTimeout(() => {
        setCurrentStage((prev) => {
          const next = prev + 1;
          scheduleNext(next, boundary);
          return next;
        });
      }, msUntilNext);
    }
    scheduleNext(stage, startElapsed);

    // Countdown tick
    if (remaining > 0) {
      timerRef.current = setInterval(() => {
        elapsedRef.current += 1;
        setCountdown((c) => Math.max(0, c - 1));
      }, 1000);
    }

    // Admin status polling every 15 seconds
    if (lastOrder.orderId) {
      async function pollStatus() {
        try {
          const res = await fetch(`/api/admin/orders/${lastOrder!.orderId}`);
          if (!res.ok) return;
          const data = await res.json();
          const dbStatus: string = data?.order?.status ?? "";
          if (!dbStatus) return;
          const adminStage = adminStatusToStageIndex(dbStatus);
          setCurrentStage((prev) => (adminStage > prev ? adminStage : prev));
        } catch { /* ignore */ }
      }
      pollStatus();
      pollRef.current = setInterval(pollStatus, 15_000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    clearTrackerState();
    try { localStorage.removeItem(LS_ORDER_KEY); } catch { /* ignore */ }
    if (timerRef.current) clearInterval(timerRef.current);
    if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    if (pollRef.current) clearInterval(pollRef.current);
  };

  if (!mounted || !order || dismissed) return null;

  const stages = getTrackerStages(order.orderType, order.estimatedMins);
  const isComplete = currentStage >= stages.length - 1;
  const activeStage = stages[Math.min(currentStage, stages.length - 1)];
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  const totalSecs = order.estimatedMins * 60;
  const progress = totalSecs > 0
    ? Math.min(100, Math.round(((totalSecs - countdown) / totalSecs) * 100))
    : 100;

  return (
    <AnimatePresence>
      <motion.div
        key="floating-tracker"
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 80, scale: 0.9 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="fixed bottom-6 right-6 z-50 w-[300px] select-none"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        <div className="bg-[#1A1A1A] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden">

          {/* ── Header ── */}
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer"
            onClick={() => setExpanded((v) => !v)}
          >
            <div className="relative flex-shrink-0">
              <div className={`w-3 h-3 rounded-full ${isComplete ? "bg-green-400" : "bg-[#FF5C00]"}`} />
              {!isComplete && (
                <div className="absolute inset-0 rounded-full bg-[#FF5C00] animate-ping opacity-60" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 leading-none mb-0.5">
                {isComplete ? "Order Complete" : "Order Tracking"}
              </p>
              <p className="text-sm font-bold text-white truncate">
                {isComplete
                  ? order.orderType === "Delivery" ? "On its way! 🛵" : "Ready for pickup! 🎉"
                  : activeStage.label}
              </p>
            </div>

            {!isComplete && (
              <span className="text-xs font-mono font-bold text-[#FF5C00] bg-[#FF5C00]/10 px-2 py-1 rounded-lg flex-shrink-0 tabular-nums">
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </span>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
              className="text-white/30 hover:text-white transition-colors flex-shrink-0"
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
              className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>

          {/* ── Progress bar ── */}
          <div className="h-[2px] bg-white/5 mx-4 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isComplete ? "bg-green-400" : "bg-[#FF5C00]"}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          {/* ── Expanded panel ── */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-3 space-y-2">
                  {stages.map((stage, i) => {
                    const isDone = i < currentStage;
                    const isActive = i === currentStage;
                    return (
                      <div
                        key={stage.id}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                          isActive
                            ? "bg-[#FF5C00]/10 border border-[#FF5C00]/20"
                            : isDone ? "opacity-50" : "opacity-25"
                        }`}
                      >
                        <span className="text-base w-6 text-center flex-shrink-0">
                          {isDone
                            ? <CheckCircle size={16} className="text-green-400 mx-auto" />
                            : stage.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate ${isActive ? "text-white" : "text-white/50"}`}>
                            {stage.label}
                          </p>
                          {isActive && (
                            <p className="text-[10px] text-neutral-500 truncate">{stage.description}</p>
                          )}
                        </div>
                        {isActive && !isComplete && (
                          <span className="flex gap-0.5 flex-shrink-0">
                            {[0, 1, 2].map((dot) => (
                              <motion.span
                                key={dot}
                                className="w-1 h-1 rounded-full bg-[#FF5C00]"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }}
                              />
                            ))}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  <Link
                    href="/confirmation"
                    className="block text-center text-[11px] font-bold text-[#FF5C00] hover:text-[#E65200] transition-colors pt-1"
                  >
                    View full tracker →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
