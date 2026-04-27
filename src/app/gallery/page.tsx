"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import FaqSection from "@/components/FaqSection";
import { motion } from "framer-motion";

const galleryItems = [
  {
    image: "/images/pages/gallery/image1.avif",
    title: "Clean & hygienic kitchen view",
    rotate: -3
  },
  {
    image: "/images/pages/gallery/image2.avif",
    title: "Always serve with love",
    rotate: 2
  },
  {
    image: "/images/pages/gallery/image3.avif",
    title: "Famous visit to restaurant",
    rotate: -2
  }
];

export default function Gallery() {
  return (
    <main className="bg-white overflow-hidden relative min-h-screen">
      {/* Global Background Glows */}
      <div className="absolute top-[200px] -left-[20vw] w-[50vw] h-[600px] bg-[#FF5C00]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[200px] -right-[20vw] w-[50vw] h-[600px] bg-[#FF5C00]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center z-10 relative">
          <span className="text-[#FF5C00] font-sans font-semibold text-[11px] tracking-[0.25em] uppercase mb-4">
            VISUAL STORIES BEHIND MOMENTS
          </span>

          <h1 className="text-4xl md:text-[64px] font-serif font-medium text-[#1A1A1A] leading-[1.05] tracking-tight mb-6">
            Discover the beauty<br />of our food creations
          </h1>

          <p className="text-[#666666] text-base md:text-[16px] max-w-xl mx-auto font-sans leading-relaxed">
            Take a look at our gallery, showcasing the art and<br className="hidden md:block" />passion that go into every dish at Plateria restaurant
          </p>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="pb-16 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[32px] p-4 shadow-xl shadow-black/[0.03] border border-black/[0.02] flex flex-col items-center group cursor-pointer"
              style={{ rotate: `${item.rotate}deg` }}
            >
              <div className="w-full aspect-square rounded-[24px] overflow-hidden mb-6">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="text-[#1A1A1A] font-sans font-medium text-[16px] mb-4 text-center">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Moments Section */}
      <section className="pb-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#666666] font-sans text-lg flex items-center justify-center gap-2">
              Other moments captured with <span className="text-red-500">❤️</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { path: "image1.avif" },
              { path: "image2.avif" },
              { path: "image3.avif" },
              { path: "image4.webp" },
              { path: "image5.avif" },
              { path: "image6.webp" },
              { path: "image7.avif" },
              { path: "image8.avif" },
              { path: "image9.avif" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                viewport={{ once: true }}
                className="rounded-[32px] overflow-hidden aspect-[1.3/1] shadow-2xl shadow-black/5 group cursor-pointer"
              >
                <img 
                  src={`/images/pages/gallery/moments/${item.path}`} 
                  alt={`Moment ${i + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <FaqSection />
      <CTASection />
      <Footer />
    </main>
  );
}
