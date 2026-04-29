"use client";

import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Star } from "lucide-react";
import FaqSection from "@/components/FaqSection";
import CTASection from "@/components/CTASection";
import ChefsSection from "@/components/ChefsSection";

export default function About() {
  return (
    <main className="bg-white overflow-hidden relative min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Subtle Pink Side Shades - Positioned between Hero and Grid */}
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
        {/* Side Shadows/Gradients */}
        <div className="absolute left-0 top-0 w-48 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="max-w-[1250px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
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
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-[32px] overflow-hidden aspect-[1.3/1] shadow-2xl max-w-lg mx-auto"
          >
            <img 
              src="/images/pages/about/our journy.avif" 
              alt="Our Journey" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Right Side - Content */}
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

            {/* Mission Card */}
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
        {/* Feature 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <span className="text-[48px] md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-none mb-6">01</span>
          <h3 className="text-[20px] font-serif font-medium text-[#1A1A1A] mb-3">Global Flavors</h3>
          <p className="text-[#666666] text-[15px] font-sans leading-relaxed max-w-[260px]">
            Our chefs combine global flavors with the freshest local ingredients
          </p>
        </motion.div>

        {/* Feature 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <span className="text-[48px] md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-none mb-6">02</span>
          <h3 className="text-[20px] font-serif font-medium text-[#1A1A1A] mb-3">Ambiance</h3>
          <p className="text-[#666666] text-[15px] font-sans leading-relaxed max-w-[260px]">
            We reduce food waste by using imperfect fruits & vegetables
          </p>
        </motion.div>

        {/* Feature 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <span className="text-[48px] md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-none mb-6">03</span>
          <h3 className="text-[20px] font-serif font-medium text-[#1A1A1A] mb-3">Passion</h3>
          <p className="text-[#666666] text-[15px] font-sans leading-relaxed max-w-[260px]">
            Every dish is crafted with love and attention to details & delivering
          </p>
        </motion.div>
      </section>

      {/* Catering Section */}
      <section className="pt-12 pb-12 px-6 relative overflow-hidden">
        {/* Subtle Side Glows */}
        <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-100/30 rounded-full blur-[100px] -z-10" />
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-100/30 rounded-full blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.2em] uppercase mb-8 block"
          >
            LET US HANDLE YOU
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-[48px] font-serif font-medium text-[#1A1A1A] leading-[1.2] max-w-3xl mx-auto"
          >
            Ready to cater for<br />your all special events
          </motion.h2>
        </div>
      </section>

      {/* Special Events Section */}
      <section className="pt-0 pb-12 px-6 max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Weddings", num: "01", img: "image1.avif" },
            { title: "Birthday Parties", num: "02", img: "image2.avif" },
            { title: "Corporate Events", num: "03", img: "image3.avif" },
            { title: "Anniversaries", num: "04", img: "image4.avif" },
            { title: "Private Dinners", num: "05", img: "image5.avif" },
            { title: "Product Launches", num: "06", img: "image6.avif" },
            { title: "Holiday Celebrations", num: "07", img: "image7.avif" },
            { title: "Fundraising", num: "08", img: "image8.avif" }
          ].map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer mb-6"
            >
              <div className="rounded-[24px] overflow-hidden aspect-square mb-4 shadow-md">
                <img 
                  src={`/images/pages/about/special events/${event.img}`} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="flex justify-between items-baseline px-1">
                <h3 className="text-[17px] font-serif font-medium text-[#1A1A1A] group-hover:text-[#FF5C00] transition-colors">
                  {event.title}
                </h3>
                <span className="text-[12px] font-sans font-medium text-[#666666]/50">
                  {event.num}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <ChefsSection 
        limit={6} 
        buttonText="View menu" 
        buttonHref="/menu" 
      />

      <FaqSection />

      <CTASection />

      <Footer />
    </main>
  );
}
