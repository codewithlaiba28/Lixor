"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import BlogSection from "@/components/BlogSection";
import ReviewsSection from "@/components/ReviewsSection";
import FaqSection from "@/components/FaqSection";
import { motion } from "framer-motion";

export default function BlogPage() {
  return (
    <main className="bg-white overflow-hidden relative min-h-screen">
      {/* Background Glows */}
      <div className="absolute top-[200px] -left-[20vw] w-[50vw] h-[600px] bg-[#FF5C00]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[200px] -right-[20vw] w-[50vw] h-[600px] bg-[#FF5C00]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="pt-24">
        <BlogSection 
          title="Stay updated with the latest food stories" 
          showButton={true}
        />
      </div>

      {/* More Blog Stories Section */}
      <section className="pb-32 px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { img: "image1.avif", tag: "Tips", title: "Why your pasta never tastes like the restaurant's", date: "May 17, 2025" },
            { img: "image2.webp", tag: "Insights", title: "Secrets of perfect seasoning every home cook misses", date: "May 1, 2025" },
            { img: "image3.avif", tag: "Tips", title: "The story behind the chef: Olivia Bennett's culinary journey", date: "May 15, 2025" },
          ].map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-[24px] mb-6 aspect-[4/3]">
                <img
                  src={`/images/pages/blog/${post.img}`}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-[#FF5C00] text-white text-[11px] font-bold font-sans px-4 py-1.5 rounded-full">
                  {post.tag}
                </span>
              </div>
              <h3 className="text-[20px] font-serif font-medium text-[#1A1A1A] leading-tight mb-4 group-hover:text-[#FF5C00] transition-colors duration-300">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-[#999] text-[13px] font-sans">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/></svg>
                {post.date}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <ReviewsSection />
      <FaqSection />
      <CTASection />
      <Footer />
    </main>
  );
}
