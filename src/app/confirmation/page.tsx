"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ConfirmationPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center pt-32 pb-24 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-[#1A1A1A] text-white p-12 rounded-[48px] text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-[#FF5C00] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-500/20">
            <CheckCircle size={40} className="text-white" />
          </div>

          <h1 className="text-4xl font-serif mb-4">You're all set!</h1>
          <p className="text-neutral-400 font-sans mb-12">Your request has been received. We'll send you a confirmation message shortly.</p>

          <div className="bg-white/5 rounded-3xl p-8 mb-12 space-y-6 text-left">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#FF5C00]">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Location</p>
                <p className="text-sm font-bold">Lixor Fine Dining, Orangi Town</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#FF5C00]">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Date</p>
                <p className="text-sm font-bold">Today</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link 
              href="/"
              className="bg-[#FF5C00] hover:bg-[#E65200] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/10"
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
      </div>

      <Footer />
    </main>
  );
}
