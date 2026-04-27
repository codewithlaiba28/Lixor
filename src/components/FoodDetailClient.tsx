"use client";

import { useParams, notFound } from "next/navigation";
import { menuItems } from "@/data/menuData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowLeft, ShoppingBag } from "lucide-react";
import ReviewsSection from "@/components/ReviewsSection";
import CTASection from "@/components/CTASection";

export default function FoodDetailClient({ id }: { id: string }) {
  const item = menuItems.find((m) => m.id === id);
  if (!item) return notFound();

  const related = menuItems.filter((m) => m.id !== item.id).slice(0, 4);

  return (
    <main className="bg-white min-h-screen overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF5C00]/[0.05] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1100px] mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-10"
          >
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-[#666] hover:text-[#FF5C00] transition-colors font-sans text-[14px] group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Back to Menu
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Glow behind image */}
                <div className="absolute inset-0 bg-[#FF5C00]/10 rounded-full blur-[60px] scale-110" />
                <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full overflow-hidden shadow-2xl shadow-orange-200/50 relative z-10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover scale-[1.18]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right: Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-left"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-bold font-sans text-[#FF5C00] bg-orange-50 border border-orange-100 px-3 py-1 rounded-full uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(item.rating) ? "#FF5C00" : "#e5e7eb"}
                    className={i < Math.round(item.rating) ? "text-[#FF5C00]" : "text-gray-200"}
                  />
                ))}
                <span className="text-[#999] font-sans text-[13px] ml-1">
                  {item.rating} ({item.reviews} reviews)
                </span>
              </div>

              {/* Name */}
              <h1 className="text-4xl md:text-[52px] font-serif font-medium text-[#1A1A1A] leading-[1.1] mb-4">
                {item.name}
              </h1>

              {/* Short desc */}
              <p className="text-[#666] font-sans text-[17px] leading-relaxed mb-6">
                {item.shortDesc}
              </p>

              {/* CTA */}
              <Link
                href="/book"
                className="group inline-flex items-center gap-3 bg-[#FF5C00] hover:bg-[#E65200] text-white px-8 py-4 rounded-full text-[15px] font-bold transition-all shadow-xl shadow-orange-500/20 mb-8"
              >
                <ShoppingBag size={18} />
                <span className="relative block overflow-hidden">
                  <span className="block transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
                    Book a table
                  </span>
                  <span className="absolute inset-0 block translate-y-full transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
                    Book a table
                  </span>
                </span>
              </Link>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-[#999] font-sans text-[13px] uppercase tracking-widest">Price</span>
                <span className="text-[#1A1A1A] font-serif font-bold text-[28px]">{item.price}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Long Description */}
      <section className="py-16 px-6 bg-[#FAFAFA]">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.25em] uppercase mb-4 block"
          >
            ABOUT THIS DISH
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-[#444] font-sans text-[17px] md:text-[19px] leading-[1.8]"
          >
            {item.longDesc}
          </motion.p>
        </div>
      </section>

      {/* Explore Ingredients / Related */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto text-center">
          <span className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.25em] uppercase mb-4 block">
            PERFECT FOR BALANCED BITES
          </span>
          <h2 className="text-3xl md:text-[44px] font-serif font-medium text-[#1A1A1A] mb-16 leading-tight">
            You might also love
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {related.map((rel, i) => (
              <motion.div
                key={rel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link href={`/menu/${rel.id}`} className="flex flex-col items-center text-center group">
                  <div className="w-[140px] h-[140px] mx-auto mb-4 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-[12deg] rounded-full overflow-hidden shadow-lg">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover scale-[1.18]"
                    />
                  </div>
                  <h3 className="font-serif font-medium text-[#1A1A1A] text-[16px] mb-1 group-hover:text-[#FF5C00] transition-colors">
                    {rel.name}
                  </h3>
                  <span className="text-[#999] text-[13px] font-sans">{rel.price}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
