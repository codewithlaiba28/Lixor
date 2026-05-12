"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import OrderTracker from "@/components/OrderTracker";
import type { OrderType } from "@/lib/orderTimePrediction";

interface LastOrder {
  orderId: string;
  orderType: OrderType;
  estimatedMins: number;
  placedAt: number;
}

export default function ConfirmationPage() {
  const [mounted, setMounted] = useState(false);
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("lixor-last-order");
      if (raw) {
        const parsed: LastOrder = JSON.parse(raw);
        // Only show tracker if order was placed within the last 2 hours
        const twoHours = 2 * 60 * 60 * 1000;
        if (Date.now() - parsed.placedAt < twoHours) {
          setLastOrder(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  if (!mounted) return null;

  // Remaining time in minutes (accounting for time already elapsed)
  const elapsedMins = lastOrder
    ? Math.floor((Date.now() - lastOrder.placedAt) / 60000)
    : 0;
  const remainingMins = lastOrder
    ? Math.max(1, lastOrder.estimatedMins - elapsedMins)
    : 20;

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* ── Confirmation card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1A1A] text-white p-10 rounded-[48px] text-center shadow-2xl"
          >
            {/* Animated checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 bg-[#FF5C00] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-500/20"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-9 h-9"
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </svg>
            </motion.div>

            <h1 className="text-4xl font-serif mb-3">You&apos;re all set!</h1>
            <p className="text-neutral-400 font-sans mb-10">
              Your request has been received. We&apos;ll send you a confirmation message shortly.
            </p>

            <div className="bg-white/5 rounded-3xl p-7 mb-10 space-y-5 text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#FF5C00]">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">
                    Location
                  </p>
                  <p className="text-sm font-bold">Lixor Fine Dining, Orangi Town</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#FF5C00]">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">
                    Date
                  </p>
                  <p className="text-sm font-bold">Today</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="bg-[#FF5C00] hover:bg-[#E65200] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/10 block"
              >
                Return Home
              </Link>
              <Link
                href="/menu"
                className="text-neutral-400 hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Explore the Menu
              </Link>
            </div>
          </motion.div>

          {/* ── Live Order Tracker ── */}
          {lastOrder && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1A1A1A] text-white p-8 rounded-[40px] shadow-xl"
            >
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                  Live Order Tracker
                </p>
                <h2 className="text-2xl font-serif text-white">
                  Tracking your order
                </h2>
                {lastOrder.orderId && (
                  <p className="text-xs text-neutral-500 mt-1 font-mono">
                    #{lastOrder.orderId.slice(-8).toUpperCase()}
                  </p>
                )}
              </div>

              <OrderTracker
                orderType={lastOrder.orderType}
                estimatedMins={remainingMins}
              />
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
