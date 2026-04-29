"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewsSection from "@/components/ReviewsSection";
import FaqSection from "@/components/FaqSection";
import CTASection from "@/components/CTASection";
import { menuItems } from "@/data/menuData";
import { Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const item = menuItems.find(m => m.id === id) || menuItems.find(m => m.id === "caesar-salad")!;

  // Related items (random 4 excluding current)
  const relatedItems = menuItems
    .filter(m => m.id !== item.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Top Section: Image & Basic Info */}
      <section className="pt-32 pb-16 px-6 max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Large Dish Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 flex justify-center"
          >
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover rounded-full"
              />
              {/* Floating Decorative Elements could go here */}
            </div>
          </motion.div>

          {/* Right: Text & Pricing */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-widest uppercase">STARTER</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#FF5C00" className="text-[#FF5C00]" />
                ))}
              </div>
            </div>

            <h1 className="text-5xl md:text-[64px] font-serif font-medium text-[#1A1A1A] leading-tight mb-6">
              {item.name}
            </h1>

            <p className="text-[#666666] text-lg font-sans leading-relaxed mb-8 opacity-80 max-w-lg">
              {item.description || "Indulge in our carefully crafted menu featuring a range of flavorful dishes, from mouthwatering starters to decadent desserts."}
            </p>

            <Link
              href="/book"
              className="bg-[#FF5C00] hover:bg-[#E65200] text-white px-10 py-4 rounded-full text-[16px] font-bold transition-all shadow-xl shadow-orange-500/20 mb-8 inline-block"
            >
              Book a table
            </Link>

            <div className="text-[20px] font-sans font-bold text-[#1A1A1A] mt-4">
              {item.price}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Description Section */}
      <section className="py-16 px-6 max-w-[800px] mx-auto text-center">
        <p className="text-[#666666] text-[17px] font-sans leading-relaxed mb-16 opacity-90">
          {item.longDescription || "Every dish we serve is a testament to our commitment to quality. We source the finest ingredients and prepare them with techniques that honor tradition while embracing modern culinary creativity."}
        </p>

        <div className="flex flex-col gap-20">
          {/* Explore Ingredients */}
          <div>
            <h2 className="text-3xl md:text-[42px] font-serif font-medium text-[#1A1A1A] mb-8">
              Explore ingredients
            </h2>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {(item.ingredients || ["Fresh vegetables", "Artisan spices", "Organic herbs", "Cold-pressed oils"]).map((ing, i) => (
                <div key={i} className="flex items-center gap-2 text-[#666666] font-sans">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Balanced Bites */}
          <div>
            <h2 className="text-3xl md:text-[42px] font-serif font-medium text-[#1A1A1A] mb-6">
              Perfect for balanced bites
            </h2>
            <p className="text-[#666666] text-[16px] font-sans leading-relaxed max-w-2xl mx-auto opacity-80">
              {item.balancedBites || "A harmonious blend of proteins, fiber, and healthy fats. Designed for those who value both nutrition and exquisite taste."}
            </p>
          </div>
        </div>
      </section>

      {/* Related Dishes */}
      <section className="py-24 px-6 bg-neutral-50/50">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedItems.map((rel) => (
              <Link key={rel.id} href={`/menu/${rel.id}`} className="group flex flex-col items-center text-center">
                <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] mb-6 rounded-full overflow-hidden transition-transform duration-500 group-hover:scale-110">
                  <img src={rel.image} alt={rel.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-serif font-medium text-[#1A1A1A] text-[16px] mb-2 group-hover:text-[#FF5C00] transition-colors">{rel.name}</h4>
                <span className="text-[#999] text-[13px] font-sans uppercase">{rel.price}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />
      <FaqSection />
      <CTASection />
      <Footer />
    </main>
  );
}
