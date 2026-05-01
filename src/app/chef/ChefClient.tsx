"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import ReviewsSection from "@/components/ReviewsSection";
import FaqSection from "@/components/FaqSection";
import ChefsSection from "@/components/ChefsSection";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ChefClient() {
  return (
    <main className="bg-white overflow-hidden relative min-h-screen">
      {/* Background Glows */}
      <div className="absolute top-[200px] -left-[20vw] w-[50vw] h-[600px] bg-[#FF5C00]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[200px] -right-[20vw] w-[50vw] h-[600px] bg-[#FF5C00]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center z-10 relative">
          <span className="text-[#FF5C00] font-sans font-semibold text-[11px] tracking-[0.25em] uppercase mb-4">
            MEET THE EXPERTS
          </span>

          <h1 className="text-4xl md:text-[52px] font-serif font-medium text-[#1A1A1A] leading-[1.1] tracking-tight mb-6">
            Get to know the people<br />that creates magic
          </h1>

          <p className="text-[#666666] text-base md:text-[16px] max-w-xl mx-auto font-sans leading-relaxed mb-10">
            Come experience a world of rich flavors, cozy ambiance,<br className="hidden md:block" />and dishes crafted with love. From sizzling grills
          </p>

          <Link
            href="/menu"
            className="group inline-block bg-[#FF5C00] hover:bg-[#E65200] text-white px-10 py-4 rounded-full text-[15px] font-bold transition-all shadow-xl shadow-orange-500/20"
          >
            <span className="relative block overflow-hidden">
              <span className="block transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
                View Menu
              </span>
              <span className="absolute inset-0 block translate-y-full transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
                View Menu
              </span>
            </span>
          </Link>
        </div>
      </section>

      {/* Featured Image Section */}
      <section className="pb-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="rounded-[40px] overflow-hidden shadow-2xl shadow-black/10"
          >
            <img 
              src="/images/pages/chef/image.avif" 
              alt="Our Chefs" 
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </section>

      <ChefsSection limit={3} />
      <ReviewsSection />
      <FaqSection />
      <CTASection />
      <Footer />
    </main>
  );
}
