"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import FaqSection from "@/components/FaqSection";
import CTASection from "@/components/CTASection";
import ChefsSection from "@/components/ChefsSection";

export default function AboutClient() {
  return (
    <main className="bg-white overflow-hidden relative min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute left-[-10%] top-[80%] w-[400px] h-[400px] bg-pink-100/30 rounded-full blur-[100px] z-0 pointer-events-none" />
        <div className="absolute right-[-10%] top-[80%] w-[400px] h-[400px] bg-pink-100/30 rounded-full blur-[100px] z-0 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.2em] uppercase mb-4 block"
          >
            WHAT WE STAND FOR
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-tight mb-8"
          >
            Discover the passion<br />behind our restaurant
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/menu"
              className="group inline-block bg-[#FF5C00] hover:bg-[#E65200] text-white px-10 py-4 rounded-full text-[16px] font-bold transition-all shadow-xl shadow-orange-500/20"
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
          </motion.div>
        </div>
      </section>

      {/* Image Grid Section */}
      <section className="relative py-6 overflow-hidden">
        <div className="absolute left-0 top-0 w-48 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="max-w-[1250px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="aspect-[4/5] rounded-[24px] overflow-hidden shadow-sm"
              >
                <img 
                  src={`/images/pages/about/image${i}.avif`} 
                  alt={`Lixor Story ${i}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-[#FF5C00] font-sans font-bold text-[10px] tracking-[0.2em] uppercase mb-6 block"
          >
            CRAFTED WITH CARE AND FRESHNESS
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-[32px] font-serif font-medium text-[#1A1A1A] leading-[1.6] max-w-3xl mx-auto"
          >
            Our sauces and spreads are made from<br className="hidden md:block" />
            fresh, imperfect fruits and vegetables<br className="hidden md:block" />
            that are often overlooked. Nutritious,<br className="hidden md:block" />
            flavorful, and ready to enhance your table
          </motion.h2>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="py-12 px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-[32px] overflow-hidden aspect-[1.3/1] shadow-2xl max-w-lg mx-auto w-full"
          >
            <img 
              src="/images/pages/about/our journy.avif" 
              alt="Our Journey" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.2em] uppercase mb-4 block">
              OUR JOURNEY OF PASSION
            </span>
            <h2 className="text-[32px] md:text-[48px] font-serif font-medium text-[#1A1A1A] leading-tight mb-6">
              Where flavor meets passion on every plate
            </h2>
            <p className="text-[#666666] text-lg font-sans leading-relaxed mb-8 opacity-80">
              Dining is not just a meal; it&apos;s an experience. We&apos;ve always been dedicated to combining global flavors with fresh ingredients.
            </p>

            <div className="bg-[#FF5C00] p-8 rounded-[32px] text-white shadow-xl shadow-orange-500/20 max-w-md">
              <h3 className="text-xl font-serif font-bold mb-3">Our Mission</h3>
              <p className="text-white/90 text-md font-sans leading-relaxed">
                We believe in using perfectly imperfect fruits and vegetables to create our sauces and spreads
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 max-w-[1100px] mx-auto py-12 z-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 lg:gap-24 text-center">
        {[
          { num: "01", title: "Global Flavors", desc: "Our chefs combine global flavors with the freshest local ingredients" },
          { num: "02", title: "Ambiance", desc: "We reduce food waste by using imperfect fruits & vegetables" },
          { num: "03", title: "Great Service", desc: "Our team is dedicated to making your dining experience smooth" }
        ].map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <span className="text-[48px] md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-none mb-6">{f.num}</span>
            <h3 className="text-[20px] font-serif font-medium text-[#1A1A1A] mb-3">{f.title}</h3>
            <p className="text-[#666666] text-[15px] font-sans leading-relaxed max-w-[260px]">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </section>

      <ChefsSection limit={6} buttonText="View menu" buttonHref="/menu" />
      <FaqSection />
      <CTASection />
      <Footer />
    </main>
  );
}
