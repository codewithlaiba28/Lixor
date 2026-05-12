"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import {
  getTrackerStages,
  adminStatusToStageIndex,
  type OrderType,
} from "@/lib/orderTimePrediction";

interface Props {
  orderType: OrderType;
  estimatedMins: number;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
const LS_KEY = "lixor-tracker-state";
const LS_ORDER_KEY = "lixor-last-order";

interface TrackerState {
  currentStage: number;
  savedAt: number;
  totalSecs: number;
  elapsedSecs: number;
}

interface LastOrder {
  orderId: string;
  orderType: OrderType;
  estimatedMins: number;
  placedAt: number;
}

function loadTrackerState(): TrackerState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as TrackerState) : null;
  } catch {
    return null;
  }
}

function saveTrackerState(state: TrackerState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function clearTrackerState() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch { /* ignore */ }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrderTracker({ orderType, estimatedMins }: Props) {
  const stages = getTrackerStages(orderType, estimatedMins);
  const totalSecs = estimatedMins * 60;

  // ── Initialise from localStorage ─────────────────────────────────────────
  const [currentStage, setCurrentStage] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const saved = loadTrackerState();
    if (!saved) return 0;
    const passedSince = Math.floor((Date.now() - saved.savedAt) / 1000);
    const totalElapsed = saved.elapsedSecs + passedSince;
    let acc = 0;
    for (let i = 0; i < stages.length - 1; i++) {
      acc += stages[i].durationSecs;
      if (totalElapsed < acc) return i;
    }
    return stages.length - 1;
  });

  const [countdown, setCountdown] = useState<number>(() => {
    if (typeof window === "undefined") return totalSecs;
    const saved = loadTrackerState();
    if (!saved) return totalSecs;
    const passedSince = Math.floor((Date.now() - saved.savedAt) / 1000);
    const totalElapsed = saved.elapsedSecs + passedSince;
    return Math.max(0, saved.totalSecs - totalElapsed);
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef<number>(0);
  const currentStageRef = useRef<number>(currentStage);

  useEffect(() => { currentStageRef.current = currentStage; }, [currentStage]);

  // ── Restore elapsed on mount ──────────────────────────────────────────────
  const computeStageFromElapsed = useCallback(
    (elapsedSecs: number): number => {
      let acc = 0;
      for (let i = 0; i < stages.length - 1; i++) {
        acc += stages[i].durationSecs;
        if (elapsedSecs < acc) return i;
      }
      return stages.length - 1;
    },
    [stages]
  );

  // ── Admin status polling — check every 3 seconds for near-instant sync ──
  useEffect(() => {
    const lastOrder: LastOrder | null = (() => {
      try {
        const raw = localStorage.getItem(LS_ORDER_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    })();

    if (!lastOrder?.orderId) return;

    async function pollAdminStatus() {
      try {
        const res = await fetch(`/api/admin/orders/${lastOrder!.orderId}`);
        if (!res.ok) return;
        const data = await res.json();
        const dbStatus: string = data?.order?.status ?? data?.status ?? "";
        if (!dbStatus) return;

        const adminStage = adminStatusToStageIndex(dbStatus);
        // Only advance forward, never go back
        setCurrentStage((prev) => {
          if (adminStage > prev) {
            currentStageRef.current = adminStage;
            return adminStage;
          }
          return prev;
        });
      } catch { /* network error — ignore */ }
    }

    // Poll immediately, then every 3 seconds for near-instant sync
    pollAdminStatus();
    const pollId = setInterval(pollAdminStatus, 3_000);
    return () => clearInterval(pollId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Stage advancement (time-based fallback) ───────────────────────────────
  useEffect(() => {
    const saved = loadTrackerState();
    let startElapsed = 0;

    if (saved) {
      const passedSince = Math.floor((Date.now() - saved.savedAt) / 1000);
      startElapsed = saved.elapsedSecs + passedSince;
      const restoredStage = computeStageFromElapsed(startElapsed);
      setCurrentStage(restoredStage);
      setCountdown(Math.max(0, saved.totalSecs - startElapsed));
    }

    elapsedRef.current = startElapsed;

    function scheduleNextStage(fromStage: number, fromElapsed: number) {
      if (fromStage >= stages.length - 1) return;
      let boundary = 0;
      for (let i = 0; i <= fromStage; i++) boundary += stages[i].durationSecs;
      const msUntilNext = Math.max(0, (boundary - fromElapsed) * 1000);

      stageTimerRef.current = setTimeout(() => {
        setCurrentStage((prev) => {
          const next = prev + 1;
          currentStageRef.current = next;
          scheduleNextStage(next, boundary);
          return next;
        });
      }, msUntilNext);
    }

    const initialStage = saved ? computeStageFromElapsed(startElapsed) : 0;
    scheduleNextStage(initialStage, startElapsed);

    return () => { if (stageTimerRef.current) clearTimeout(stageTimerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Countdown tick ────────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return;

    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;

      if (elapsedRef.current % 5 === 0) {
        saveTrackerState({
          currentStage: currentStageRef.current,
          savedAt: Date.now(),
          totalSecs,
          elapsedSecs: elapsedRef.current,
        });
      }

      setCountdown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      saveTrackerState({
        currentStage: currentStageRef.current,
        savedAt: Date.now(),
        totalSecs,
        elapsedSecs: elapsedRef.current,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Clear on complete ─────────────────────────────────────────────────────
  useEffect(() => {
    if (currentStage === stages.length - 1) {
      setTimeout(() => clearTrackerState(), 60_000);
    }
  }, [currentStage, stages.length]);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const isComplete = currentStage === stages.length - 1;

  return (
    <div className="space-y-6">
      {/* Countdown */}
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
              Estimated time remaining
            </p>
            <p className="text-5xl font-serif font-bold text-white tabular-nums">
              {String(mins).padStart(2, "0")}
              <span className="text-[#FF5C00] mx-1 animate-pulse">:</span>
              {String(secs).padStart(2, "0")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <p className="text-xl font-bold text-white">
              {orderType === "Delivery" ? "On its way! 🛵" : "Ready for pickup! 🎉"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage list */}
      <div className="space-y-3">
        {stages.map((stage, i) => {
          const isDone = i < currentStage;
          const isActive = i === currentStage;
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-500 ${
                isActive
                  ? "bg-[#FF5C00]/10 border-[#FF5C00]/30"
                  : isDone
                  ? "bg-white/5 border-white/5 opacity-60"
                  : "bg-white/[0.02] border-white/5 opacity-30"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                  isActive ? "bg-[#FF5C00]/20" : isDone ? "bg-white/10" : "bg-white/5"
                }`}
              >
                {isDone ? (
                  <CheckCircle size={18} className="text-green-400" />
                ) : isActive ? (
                  <span>{stage.icon}</span>
                ) : (
                  <Circle size={18} className="text-white/20" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold ${isActive ? "text-white" : isDone ? "text-white/60" : "text-white/30"}`}>
                    {stage.label}
                  </p>
                  {isActive && (
                    <span className="flex gap-0.5">
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
                <p className={`text-xs mt-0.5 ${isActive ? "text-neutral-400" : "text-white/20"}`}>
                  {stage.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
