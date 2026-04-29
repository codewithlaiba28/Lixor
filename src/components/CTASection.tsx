"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-12 px-6 bg-[#FF5C00] overflow-hidden">
      {/* Floating Images - Left */}
      <div className="absolute left-[-20px] top-[10%] hidden lg:block z-0 opacity-100">
        <motion.img 
          initial={{ opacity: 0, x: -50, rotate: -15 }}
          whileInView={{ opacity: 1, x: 0, rotate: -6 }}
          transition={{ duration: 1, ease: "easeOut" }}
          src="/images/memorable meal/image3.avif" 
          alt="Food" 
          className="w-[180px] h-[180px] object-cover rounded-[24px]" 
        />
      </div>
      <div className="absolute left-[80px] top-[20%] hidden lg:block z-10 opacity-100">
        <motion.img 
          initial={{ opacity: 0, x: -80, rotate: 0 }}
          whileInView={{ opacity: 1, x: 0, rotate: 6 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          src="/images/memorable meal/image1.avif" 
          alt="Food" 
          className="w-[240px] h-[280px] object-cover rounded-[32px] shadow-2xl" 
        />
      </div>

      {/* Floating Images - Right */}
      <div className="absolute right-[-20px] top-[10%] hidden lg:block z-0 opacity-100">
        <motion.img 
          initial={{ opacity: 0, x: 50, rotate: 15 }}
          whileInView={{ opacity: 1, x: 0, rotate: 6 }}
          transition={{ duration: 1, ease: "easeOut" }}
          src="/images/memorable meal/image4.avif" 
          alt="Food" 
          className="w-[180px] h-[180px] object-cover rounded-[24px]" 
        />
      </div>
      <div className="absolute right-[80px] top-[20%] hidden lg:block z-10 opacity-100">
        <motion.img 
          initial={{ opacity: 0, x: 80, rotate: 0 }}
          whileInView={{ opacity: 1, x: 0, rotate: -6 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          src="/images/memorable meal/image2.avif" 
          alt="Food" 
          className="w-[240px] h-[280px] object-cover rounded-[32px] shadow-2xl" 
        />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-20">
        <span className="text-white/80 font-sans font-bold text-[11px] tracking-[0.25em] uppercase mb-6">
          RESERVE YOUR SPOT TODAY
        </span>
        
        <h2 className="text-4xl md:text-[64px] font-serif font-medium text-white leading-tight mb-8">
          Ready to indulge in a<br />memorable meal?
        </h2>

        <p className="text-white/90 text-[18px] font-sans max-w-lg mb-12 leading-relaxed">
          Reserve your table now and enjoy a delightful<br className="hidden md:block" />
          dining experience with exceptional flavors
        </p>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <Link
            href="/book"
            className="group inline-block bg-white text-[#FF5C00] px-8 py-3.5 rounded-full text-[15px] font-bold transition-all shadow-lg hover:bg-orange-50 mb-6 md:mb-0"
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

          <div className="flex items-center gap-2">
            <span className="text-white font-sans font-bold text-[14px]">(4.9/5)</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} fill="white" className="text-white" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
