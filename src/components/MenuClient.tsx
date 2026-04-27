"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuSection from "@/components/MenuSection";
import ReviewsSection from "@/components/ReviewsSection";
import FaqSection from "@/components/FaqSection";
import CTASection from "@/components/CTASection";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function MenuClient() {
  return (
    <main className="bg-white overflow-hidden relative min-h-screen">
      {/* Global Background Glows */}
      <div className="absolute top-[200px] -left-[20vw] w-[50vw] h-[600px] bg-[#FF5C00]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[200px] -right-[20vw] w-[50vw] h-[600px] bg-[#FF5C00]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <Navbar />
      
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center z-10 relative">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#FF5C00] font-sans font-semibold text-[11px] tracking-[0.15em] uppercase mb-4"
          >
            WHAT WE SERVE
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-[1.05] tracking-tight mb-6"
          >
            Explore our menu<br />of delicious dishes
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#666666] text-base md:text-[18px] max-w-xl mx-auto mb-10 font-sans leading-relaxed"
          >
            Indulge in our carefully crafted menu featuring a<br className="hidden md:block" />range of flavorful dishes, from mouthwatering starters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/book"
              className="group inline-block bg-[#FF5C00] hover:bg-[#E65200] text-white px-10 py-4 rounded-full text-[15px] font-bold transition-all shadow-xl shadow-orange-500/25"
            >
              <span className="relative block overflow-hidden">
                <span className="block transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
                  Book a table
                </span>
                <span className="absolute inset-0 block translate-y-full transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
                  Book a table
                </span>
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Gallery & Testimonial Section */}
      <section className="pb-16 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1fr] gap-6 items-stretch">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-[32px] overflow-hidden h-[360px] md:h-[440px]"
          >
            <img 
              src="/images/pages/menu/image1.avif" 
              alt="Waiter serving food" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-[32px] overflow-hidden h-[360px] md:h-[440px] md:col-span-1 lg:col-span-1"
          >
            <img 
              src="/images/pages/menu/image2.avif" 
              alt="Couple dining" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white rounded-[32px] p-8 flex flex-col justify-between border border-black/5 shadow-sm h-auto lg:h-[440px] md:col-span-2 lg:col-span-1"
          >
            <div>
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#FF5C00" className="text-[#FF5C00]" />
                ))}
              </div>
              <p className="text-[#666666] text-lg md:text-[20px] font-sans leading-relaxed">
                Our sauces and spreads are made from perfectly imperfect fruits and vegetables that others discard. Nutritious, delicious, and ready for your table
              </p>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <img src="/images/pages/menu/image3.avif" alt="Customer" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-serif font-bold text-[#1A1A1A]">Sarah Johnson</h4>
                <p className="text-[#999] text-sm">Regular Customer</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <MenuSection />
      <ReviewsSection />
      <FaqSection />
      <CTASection />
      <Footer />
    </main>
  );
}
