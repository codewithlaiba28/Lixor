"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Zap } from "lucide-react";
import { SPIN_WHEEL_SLICES, DEAL_DISPLAY } from "@/lib/dealsConfig";
import { useDeals } from "@/store/useDeals";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function pickWeightedSlice() {
  const total = SPIN_WHEEL_SLICES.reduce((s, sl) => s + sl.weight, 0);
  let rand = Math.random() * total;
  for (const slice of SPIN_WHEEL_SLICES) {
    rand -= slice.weight;
    if (rand <= 0) return slice;
  }
  return SPIN_WHEEL_SLICES[SPIN_WHEEL_SLICES.length - 1];
}

// ─── Canvas Wheel ─────────────────────────────────────────────────────────────

interface WheelCanvasProps {
  rotation: number; // degrees
}

function WheelCanvas({ rotation }: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliceCount = SPIN_WHEEL_SLICES.length;
  const sliceAngle = (2 * Math.PI) / sliceCount;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 4;

    ctx.clearRect(0, 0, size, size);

    // Save and rotate the whole wheel
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    SPIN_WHEEL_SLICES.forEach((slice, i) => {
      const startAngle = i * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;

      // Slice fill
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();

      // Slice border
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${size < 280 ? 10 : 12}px Outfit, sans-serif`;
      ctx.fillText(slice.label, radius - 12, 4);
      // Emoji
      ctx.font = `${size < 280 ? 14 : 16}px serif`;
      ctx.fillText(slice.emoji, radius - 12 - (size < 280 ? 60 : 72), 6);
      ctx.restore();
    });

    ctx.restore();

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = "#1A1A1A";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "#FF5C00";
    ctx.fill();
  }, [rotation, sliceAngle]);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={280}
      className="rounded-full"
      style={{ display: "block" }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SpinWheel() {
  const { spinOpen, setSpinOpen, setSpinResult, setAppliedCode } = useDeals();
  const [showButton, setShowButton] = useState(false);
  const [alreadySpun, setAlreadySpun] = useState(() => {
    // Lazy initializer — runs only on mount, safe from the lint rule
    if (typeof window === "undefined") return false;
    try {
      const saved = localStorage.getItem(DEAL_DISPLAY.spinResultKey);
      if (saved) {
        const { date } = JSON.parse(saved);
        return date === getTodayKey();
      }
    } catch { /* ignore */ }
    return false;
  });
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<(typeof SPIN_WHEEL_SLICES)[0] | null>(null);
  const [copied, setCopied] = useState(false);
  const spinRef = useRef(false);

  // Show button after delay
  useEffect(() => {
    if (alreadySpun) return;
    const t = setTimeout(() => setShowButton(true), DEAL_DISPLAY.spinWheelDelay);
    return () => clearTimeout(t);
  }, [alreadySpun]);

  const handleSpin = useCallback(() => {
    if (spinning || spinRef.current) return;
    spinRef.current = true;
    setSpinning(true);
    setResult(null);

    const winner = pickWeightedSlice();
    const winnerIndex = SPIN_WHEEL_SLICES.indexOf(winner);
    const sliceAngle = 360 / SPIN_WHEEL_SLICES.length;

    // Calculate target rotation so the pointer (top) lands on the winner slice
    // Pointer is at top (0°). Slice i starts at i * sliceAngle - 90 (offset for -Math.PI/2 in canvas)
    // We want the middle of the winner slice to be at the top
    const targetSliceCenter = winnerIndex * sliceAngle + sliceAngle / 2;
    // Extra full spins for drama
    const extraSpins = 5 * 360;
    const finalRotation = rotation + extraSpins + (360 - targetSliceCenter);

    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(winner);
      setSpinResult(winner.code);
      if (winner.code) setAppliedCode(winner.code);

      // Save to localStorage so user can't spin again today
      try {
        localStorage.setItem(
          DEAL_DISPLAY.spinResultKey,
          JSON.stringify({ date: getTodayKey(), code: winner.code, label: winner.label })
        );
      } catch { /* ignore */ }
    }, 4200);
  }, [spinning, rotation, setSpinResult, setAppliedCode]);

  const handleCopy = () => {
    if (!result?.code) return;
    navigator.clipboard.writeText(result.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setSpinOpen(false);
    if (result) setAlreadySpun(true);
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {showButton && !alreadySpun && !spinOpen && (
          <motion.button
            key="spin-btn"
            initial={{ opacity: 0, scale: 0, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 20 }}
            transition={{ type: "spring", damping: 18, stiffness: 260 }}
            onClick={() => setSpinOpen(true)}
            className="fixed bottom-24 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-[#FF5C00] to-[#E65200] text-white px-4 py-3 rounded-full font-bold text-sm shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow active:scale-95"
            aria-label="Spin for a deal"
          >
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              🎡
            </motion.span>
            Spin for a Deal!
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {spinOpen && (
          <>
            <motion.div
              key="spin-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm"
              onClick={handleClose}
            />

            <motion.div
              key="spin-modal"
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              className="fixed inset-0 flex items-center justify-center z-[61] pointer-events-none px-6"
            >
              <div className="pointer-events-auto w-full max-w-sm bg-[#1A1A1A] border border-white/10 rounded-[32px] p-8 shadow-2xl text-center relative overflow-hidden">
                {/* Glow */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 bg-[#FF5C00]/15 rounded-full blur-3xl pointer-events-none" />

                {/* Close */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all"
                  aria-label="Close spin wheel"
                >
                  <X size={16} />
                </button>

                <div className="inline-flex items-center gap-1.5 bg-[#FF5C00]/20 text-[#FF5C00] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                  <Zap size={10} />
                  Spin &amp; Win
                </div>

                <h3 className="text-xl font-serif font-bold text-white mb-1">
                  Try Your Luck! 🎡
                </h3>
                <p className="text-neutral-500 text-xs mb-6">
                  Spin once per day for an exclusive deal
                </p>

                {/* Wheel container */}
                <div className="relative flex items-center justify-center mb-6">
                  {/* Pointer */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-[#FF5C00] drop-shadow-lg" />

                  <motion.div
                    animate={{ rotate: rotation }}
                    transition={
                      spinning
                        ? { duration: 4, ease: [0.17, 0.67, 0.35, 1.0] }
                        : { duration: 0 }
                    }
                    style={{ willChange: "transform" }}
                  >
                    <WheelCanvas rotation={0} />
                  </motion.div>
                </div>

                {/* Result */}
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-3xl">{result.emoji}</div>
                      <p className="text-white font-bold text-lg">{result.label}</p>

                      {result.code ? (
                        <>
                          <p className="text-neutral-400 text-sm">
                            Use this code at checkout:
                          </p>
                          <div className="bg-white/5 border border-dashed border-[#FF5C00]/40 rounded-2xl px-5 py-3 flex items-center justify-between gap-3">
                            <span className="font-mono text-xl font-bold text-[#FF5C00] tracking-widest">
                              {result.code}
                            </span>
                            <button
                              onClick={handleCopy}
                              className="flex items-center gap-1 text-xs font-bold text-white/60 hover:text-white transition-colors"
                              aria-label="Copy code"
                            >
                              {copied ? (
                                <Check size={14} className="text-green-400" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                          <button
                            onClick={handleClose}
                            className="w-full bg-[#FF5C00] hover:bg-[#E65200] text-white py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
                          >
                            Claim &amp; Order Now →
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-neutral-500 text-sm">
                            No luck this time — try again tomorrow!
                          </p>
                          <button
                            onClick={handleClose}
                            className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-2xl font-bold text-sm transition-all"
                          >
                            Maybe Next Time
                          </button>
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <motion.button
                      key="spin-action"
                      onClick={handleSpin}
                      disabled={spinning}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-[#FF5C00] hover:bg-[#E65200] disabled:bg-neutral-700 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-orange-500/20"
                    >
                      {spinning ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="inline-block"
                          >
                            🎡
                          </motion.span>
                          Spinning…
                        </span>
                      ) : (
                        "Spin the Wheel!"
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
