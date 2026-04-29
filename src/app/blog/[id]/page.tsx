"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { blogPosts } from "@/data/blogData";
import Link from "next/link";

export default function BlogPostPage() {
  const params = useParams();
  const id = params.id as string;
  const post = blogPosts.find(p => p.id === id) || blogPosts[0];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Header Section */}
      <section className="pt-32 pb-12 px-6 max-w-[900px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className={`${post.tagColor} text-white text-[11px] font-bold font-sans px-4 py-1.5 rounded-full`}>
              {post.tag}
            </span>
            <span className="text-[#999] text-[13px] font-sans">
              {post.date}
            </span>
          </div>
          <h1 className="text-4xl md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-tight mb-8">
            {post.title}
          </h1>
        </motion.div>
      </section>

      {/* Featured Image Section */}
      <section className="pb-16 px-6 max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[32px] overflow-hidden aspect-[16/9] shadow-2xl"
        >
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="pb-24 px-6 max-w-[800px] mx-auto">
        {post.content.map((section, idx) => (
          <div key={idx} className="mb-16">
            <h2 className="text-2xl md:text-[32px] font-serif font-medium text-[#1A1A1A] mb-6">
              {section.sectionTitle}
            </h2>
            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-[#666666] text-lg font-sans leading-relaxed mb-6 opacity-90">
                {p}
              </p>
            ))}
            
            {section.list && (
              <div className="mt-8 bg-neutral-50 p-8 rounded-[24px]">
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-6">
                  {section.list.title}
                </h3>
                <ul className="flex flex-col gap-4">
                  {section.list.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-3 text-[#666666] font-sans text-[16px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] mt-2.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {/* Navigation Back */}
        <div className="pt-12 border-t border-black/5 flex justify-center">
          <Link 
            href="/blog"
            className="text-[#FF5C00] font-sans font-bold text-[15px] hover:underline"
          >
            ← Back to all stories
          </Link>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
