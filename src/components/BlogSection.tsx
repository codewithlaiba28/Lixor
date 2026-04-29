"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface BlogSectionProps {
  subtitle?: string;
  title?: string;
  showButton?: boolean;
}

export default function BlogSection({ 
  subtitle = "FRESH TIPS & UPDATES", 
  title = "Food stories & blogs",
  showButton = false
}: BlogSectionProps) {
  return (
    <section className="py-20 px-6 bg-white flex flex-col items-center text-center">
      <span className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.25em] uppercase mb-6">
        {subtitle}
      </span>
      
      <h2 className="text-4xl md:text-[52px] font-serif font-medium text-[#1A1A1A] leading-tight mb-8 max-w-2xl">
        {title}
      </h2>

      {showButton && (
        <Link
          href="/booking"
          className="group inline-block bg-[#FF5C00] hover:bg-[#E65200] text-white px-8 py-3 rounded-full text-[14px] font-bold transition-all shadow-xl shadow-orange-500/20 mb-16"
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
      )}

      {/* Blog Grid */}
      <div className="w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-left">

        {/* Featured Large Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="group cursor-pointer"
        >
          <div className="relative overflow-hidden rounded-[24px] mb-5 h-[460px]">
            <img
              src="/images/Food stories and blogs/image1.avif"
              alt="Featured blog"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute top-4 left-4 bg-[#FF5C00] text-white text-[11px] font-bold font-sans px-4 py-1.5 rounded-full">
              Cooking
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#999] text-[13px] font-sans mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/></svg>
            May 8, 2025
          </div>
          <h3 className="text-3xl md:text-[36px] font-serif font-medium text-[#1A1A1A] leading-[1.2] group-hover:text-[#FF5C00] transition-colors duration-300">
            The silent hidden power of acid in every dish
          </h3>
        </motion.div>

        {/* Right: 3 smaller cards */}
        <div className="flex flex-col justify-start gap-3">
          {[
            { img: "image2.avif", tag: "Cooking", tagColor: "bg-[#FF5C00]", title: "From pan to plate: timing is everything", date: "May 14, 2025" },
            { img: "image3.avif", tag: "Insights", tagColor: "bg-[#2D6A4F]", title: "Cooking with color: what your plate is missing", date: "May 18, 2025" },
            { img: "image4.avif", tag: "Tips", tagColor: "bg-[#E07B39]", title: "The one knife skill that changes everything", date: "May 2, 2025" },
          ].map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="group flex gap-3 cursor-pointer"
            >
              <div className="relative w-[290px] flex-shrink-0 h-[185px] overflow-hidden rounded-[18px]">
                <img
                  src={`/images/Food stories and blogs/${post.img}`}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className={`absolute top-3 left-3 ${post.tagColor} text-white text-[10px] font-bold font-sans px-3 py-1 rounded-full`}>
                  {post.tag}
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-[18px] font-serif font-medium text-[#1A1A1A] leading-snug mb-3 group-hover:text-[#FF5C00] transition-colors duration-300">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-[#999] text-[12px] font-sans">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/></svg>
                  {post.date}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
